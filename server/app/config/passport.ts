import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserModel } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

passport.serializeUser((user: any, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (userId: string, done) => {
  try {
    const user = await UserModel.findOne({ userId });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_clientID! ,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,

      scope: ['profile', 'email'], // Request profile and email scopes
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create the user based on Google profile
        let user = await UserModel.findOne({ email: profile.emails?.[0]?.value });

        if (!user) {
          // Create a new user if they don't exist
          user = new UserModel({
            userId: uuidv4(),
            firstName: profile.name?.givenName || 'Unknown',
            lastName: profile.name?.familyName || 'User',
            email: profile.emails?.[0]?.value!,
            password: '', // No password needed for OAuth users
            googleId: profile.id, // Store Google ID for future lookups
          });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
