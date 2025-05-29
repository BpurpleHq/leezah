import { Response, Request, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { userId: string };
}

// Register User
export const registerUser = async(req: Request, res: Response, next: NextFunction): Promise<Response | void>  => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!email || !firstname || !lastname || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 14);
    const userId = uuidv4().replace(/-/g, '');

    const user = new UserModel({
      userId,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      createdAt: Date.now()
      
    });

    await user.save();

    const userResponse = {
      userId: user.userId,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      createdAt: user.createdAt,
    };

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

//LoginUser
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
      
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password.toString());
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
      
    }

    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      
      success: true,
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      
    });
  } catch (error) {
    next(error);
  }
};



// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// const JWT_EXPIRES_IN = '1h'; 

// export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       res.status(400).json({ error: 'Email and password are required' });
//       return;
//     }
//     // Find user by email
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       res.status(401).json({ error: 'Invalid email or password' });
//       return;
//     }

//     // Compare password
    
//     const isPasswordValid = await bcrypt.compare(password, user.password.toString());
//     if (!isPasswordValid) {
//       res.status(401).json({ error: 'Invalid email or password' });
//       return;
//     }

//     // Create JWT payload
//     const payload = {
//       userId: user.userId,
//       email: user.email,
//     };

//     // Sign token
//     const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
//     res.json({ token });

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         userId: user.userId,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         email: user.email,
//       },
      
//     });
//   } catch (error) {
    
//     next(error);
//   }
  
// };

//DeleteUSer

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.id;

  try {
    const deletedUser = await UserModel.findOneAndDelete({ userId });

    if (!deletedUser) {
      res.status(404).json({ success: false, message: `User with ID ${userId} not found` });
      return;
    }

    res.status(200).json({
      success: true,
      message: `User with ID ${userId} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// Get User By ID
export const getUserById = async(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>  => {
  try {
     const userId = req.params.id;
    const user = await UserModel.findOne({ userId }).select('-password -__v').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: `User with ID ${userId} not found` });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Get All Users
export const getAllUsers = async(req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>  => {
  try {
    const users = await UserModel.find().select('-password -__v').lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Update User Profile
export const updateUserProfile = async(req: Request, res: Response, next: NextFunction): Promise<Response | void>  => {
  const userId = req.params.id;
  const { jobtitle, company, phone, description } = req.body;

  try {
    const updateData: Partial<typeof req.body> = {};
    if (jobtitle) updateData.jobtitle = jobtitle;
    if (company) updateData.company = company;
    if (phone) updateData.phone = phone;
    if (description) updateData.description = description;

    // Add updatedAt timestamp inside $set
    const updatedUser = await UserModel.findOneAndUpdate(
      { userId },
      { $set: { ...updateData, updatedAt: new Date() } },
      { new: true, select: '-password -__v' }
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};



