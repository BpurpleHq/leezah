import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth_middleware';
import { CardModel } from '../models/Card';
import QRCode from 'qrcode';


export const generateShareableLink = async (req: AuthRequest, res: Response, _next: NextFunction): Promise<Response | void> => {
  const { cardId } = req.params;

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
  }

  if (!cardId) {
    return res.status(400).json({ error: 'Card ID is required' });
  }

  try {
    const digitalCard = await CardModel.findOne({ cardId, userId: req.user.userId });
    if (!digitalCard) {
      return res.status(404).json({ error: 'Digital card not found' });
    }

    // Generate shareable link (simplified example)
    const shareableUrl = `https://digital-business-card.onrender.com/card/${cardId}`; // Adjust based on your domain
    digitalCard.shareableLink = {
      url: shareableUrl,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
    };

    // Generate QR code for the shareable link
    const qrCodeData = await QRCode.toDataURL(shareableUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
    });
    digitalCard.qrCode = qrCodeData;

    digitalCard.updatedAt = new Date();
    await digitalCard.save();

    return res.status(200).json({
      message: 'Shareable link and QR code generated successfully',
      shareableLink: digitalCard.shareableLink,
      qrCode: qrCodeData,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error generating shareable link`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
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