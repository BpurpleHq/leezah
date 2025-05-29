import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Contact } from '../interfaces/contact';

const contactSchema = new Schema<Contact>({
  contactId: { type: String, default: uuidv4, unique: true },
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  company: { type: String },
  jobTitle: { type: String },
  notes: { type: String },
  sourceCardId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ContactModel = model<Contact>('Contact', contactSchema);