import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth_middleware';
import { CardModel } from '../models/Card';
import { UserModel } from '../models/User';
import { v4 as uuidv4 } from 'uuid';


// Helper function to validate link types based on subscription plan
// const validateLinkTypes = (links: { type: string; url: string }[], subscriptionPlan: string): string | null => {
//   const allowedLinkTypes: { [key: string]: string[] } = {
//     free: ['email', 'phone', 'linkedin'],
//     pro: ['email', 'phone', 'linkedin', 'website', 'twitter'],
//     'pro-plus': ['email', 'phone', 'linkedin', 'website', 'twitter', 'custom'],
//   };
//   const userAllowedLinkTypes = allowedLinkTypes[subscriptionPlan] || allowedLinkTypes.free;

//   for (const link of links) {
//     if (!userAllowedLinkTypes.includes(link.type)) {
//       return `Link type '${link.type}' is not allowed on your plan. Upgrade to access more link types.`;
//     }
//     // Validate URL format (basic check)
//     if (!link.url.match(/^(http|https):\/\/[^ "]+$/)) {
//       return `Invalid URL format for link type '${link.type}': ${link.url}`;
//     }
//   }
//   return null;
// };

// Create a new digital card
export const createDigitalCard = async (req: AuthRequest, res: Response, _next: NextFunction): Promise<Response | void>  => {
  const { title, links } = req.body;

  // Input validation
  if ( !title || !links || !Array.isArray(links) || links.length === 0) {
    return res.status(400).json({ error: 'Title and at least one link are required' });
  }

  const user = await UserModel.findOne({ userId: req.user?.userId });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check card limit based on subscription plan
//   const planLimits: { [key: string]: number } = {
//     free: 1,
//     pro: 3,
//     'pro-plus': 5,
//   };
//   const maxCards = planLimits[user.subscription.plan];
//   const currentCardCount = await DigitalCardModel.countDocuments({ userId: req.user?.userId });

//   if (currentCardCount >= maxCards) {
//     return res.status(403).json({
//       error: `You have reached the maximum number of digital cards for your plan (${maxCards}). Upgrade your plan to create more.`,
//     });
//   }

  // Validate link types based on subscription plan
//   const linkValidationError = validateLinkTypes(links, user.subscription.plan);
//   if (linkValidationError) {
//     return res.status(403).json({ error: linkValidationError });
//   }

  const digitalCard = new CardModel({
    cardId: uuidv4(),
    userId: req.user?.userId,
    title,
    links,
  });

  await digitalCard.save();

  // Log the creation event
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    message: 'Digital card created',
    userId: req.user?.userId,
    cardId: digitalCard.cardId,
  }));

  res.status(201).json({ message: 'Digital card created successfully', card: digitalCard });
};

// Update an existing digital card
export const updateDigitalCard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>  => {
  const { cardId } = req.params;
  const { title, links } = req.body;

  // At least one field to update is required
  if (!title && (!links || !Array.isArray(links))) {
    return res.status(400).json({ error: 'At least one field (title or links) is required to update' });
  }

  const card = await CardModel.findOne({ cardId, userId: req.user?.userId });
  if (!card) {
    return res.status(404).json({ error: 'Digital card not found or you do not have permission to update it' });
  }

  const user = await UserModel.findOne({ userId: req.user?.userId });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Validate link types if links are being updated
//   if (links) {
//     const linkValidationError = validateLinkTypes(links, user.subscription.plan);
//     if (linkValidationError) {
//       return res.status(403).json({ error: linkValidationError });
//     }
//     card.links = links;
//   }

  if (title) card.title = title;
  card.updatedAt = new Date();

  await card.save();

  // Log the update event
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    message: 'Digital card updated',
    userId: req.user?.userId,
    cardId: card.cardId,
  }));

  res.json({ message: 'Digital card updated successfully', card });
};

// Delete a digital card
export const deleteDigitalCard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>  => {
  const { cardId } = req.params;

//   const card = await CardModel.findOneAndDelete({ cardId, userId: req.user?.userId });
const card = await CardModel.findOneAndDelete({ cardId });
  if (!card) {
    return res.status(404).json({ error: 'Digital card not found or you do not have permission to delete it' });
  }

  // Log the deletion event
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    message: 'Digital card deleted',
    userId: req.user?.userId,
    cardId: card.cardId,
  }));

  res.status(204).send();
};

// Get all digital cards for the user
export const getDigitalCards = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>  => {
 const cards = await CardModel.find({ userId: req.user?.userId });

  res.json(cards);
};

// Get a specific digital card by ID
export const getDigitalCardById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void>  =>{
  const { cardId } = req.params;
  const card = await CardModel.findOne({ cardId, userId: req.user?.userId });

  if (!card) {
    return res.status(404).json({ error: 'Digital card not found or you do not have permission to view it' });
  }
  res.json(card);
};