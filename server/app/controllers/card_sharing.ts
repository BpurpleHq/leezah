import { Request, Response, NextFunction } from 'express';
// import { AuthRequest } from '../middleware/authMiddleware';
import { CardModel } from '../models/Card';

// Generate a shareable link for a digital card
export const generateShareableLink = async (req: Request, res: Response, _next: NextFunction): Promise<Response | void>  => {
  const { cardId } = req.params;
  const { expiresInDays } = req.body; // Optional: number of days until the link expires

//   const card = await CardModel.findOne({ cardId, userId: req.user?.userId });
const card = await CardModel.findOne({ cardId});
  if (!card) {
    return res.status(404).json({ error: 'Digital card not found or you do not have permission to share it' });
  }

  if (card.shareableLink?.isActive) {
    return res.status(400).json({ error: 'This card already has an active shareable link' });
  }

  // Generate the shareable URL (e.g., https://api.example.com/card/<cardId>)
  const shareableUrl = `${process.env.BASE_URL}/card/${card.cardId}`;

  // Set expiration date if provided
  let expiresAt: Date | undefined;
  if (expiresInDays && expiresInDays > 0) {
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
  }

  // Update the card with the shareable link
  card.shareableLink = {
    url: shareableUrl,
    isActive: true,
    expiresAt,
  };

  await card.save();

  // Generate sharing links for SMS, WhatsApp, Email, LinkedIn, etc.
  const encodedUrl = encodeURIComponent(shareableUrl);
  const sharingOptions = {
    sms: `sms:?body=Check out my digital business card: ${encodedUrl}`,
    whatsapp: `https://wa.me/?text=Check out my digital business card: ${encodedUrl}`,
    email: `mailto:?subject=My Digital Business Card&body=Hi, check out my digital business card: ${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  res.json({
    message: 'Shareable link generated successfully',
    shareableUrl,
    expiresAt,
    sharingOptions,
  });
};

// Revoke a shareable link
export const revokeShareableLink = async (req: Request, res: Response, next: NextFunction): Promise<Response | void>  => {
  const { cardId } = req.params;

//   const card = await CardModel.findOne({ cardId, userId: req.user?.userId });
 const card = await CardModel.findOne({ cardId});
  if (!card) {
    return res.status(404).json({ error: 'Digital card not found or you do not have permission to revoke its link' });
  }

  if (!card.shareableLink || !card.shareableLink.isActive) {
    return res.status(400).json({ error: 'No active shareable link to revoke' });
  }

  card.shareableLink.isActive = false;
  card.shareableLink.expiresAt = undefined;
  await card.save();

  res.json({ message: 'Shareable link revoked successfully' });
};

// Public endpoint to view a shared card
export const viewSharedCard = async (req: Request, res: Response, next: NextFunction): Promise<Response | void>  => {
  const { cardId } = req.params;

  const card = await CardModel.findOne({ cardId });
  if (!card) {
    return res.status(404).json({ error: 'Digital card not found' });
  }

  if (!card.shareableLink?.isActive) {
    return res.status(403).json({ error: 'This card is not shared or the link has been revoked' });
  }

  if (card.shareableLink.expiresAt && new Date() > card.shareableLink.expiresAt) {
    card.shareableLink.isActive = false;
    await card.save();
    return res.status(403).json({ error: 'This shareable link has expired' });
  }

  res.json({
    title: card.title,
    links: card.links,
    cardId: card.cardId,
  });
};