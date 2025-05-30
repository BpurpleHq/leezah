import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '../interfaces/card';

const CardSchema = new Schema<Card>({
  cardId: { type: String, default: uuidv4, unique: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  links: [{ type: { type: String, required: true }, url: { type: String, required: true } }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  shareableLink: {
    url: { type: String },
    isActive: { type: Boolean, default: false },
    expiresAt: { type: Date },
  },
  qrCode: { type: String }, 
});

export const CardModel = model<Card>('Card', CardSchema);