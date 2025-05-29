import { Request, Response } from 'express';
// import { AuthRequest } from '../middleware/authMiddleware';
import { ContactModel } from '../models/Contact';
import { UserModel } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

// Save a contact via a form
export const saveContact = async (req: Request, res: Response) => {
  const {userId, name, email, phone, company, jobTitle, notes, sourceCardId } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and Phonenumber are required' });
  }

 const user = await UserModel.findOne({  }); 
//   const user = await UserModel.findOne({ userId: req.user?.userId });
//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

  // Enforce contact limits based on subscription plan
//   const planLimits: { [key: string]: number } = {
//     free: 5,
//     pro: Infinity, // Unlimited
//     'pro-plus': Infinity, // Unlimited
//   };
//   const maxContacts = planLimits[user.subscription.plan];
  const currentContactCount = await ContactModel.countDocuments({  });

//   if (currentContactCount >= maxContacts) {
//     return res.status(403).json({
//       error: `You have reached the maximum number of contacts for your plan (${maxContacts}). Upgrade your plan to save more.`,
//     });
//   }

  const contact = new ContactModel({
    contactId: uuidv4(),
    userId,
    name,
    email,
    phone,
    company,
    jobTitle,
    notes,
    sourceCardId,
  });

  await contact.save();
  res.status(201).json({ message: 'Contact saved successfully', contact });
};

// Get the user's contact list
export const getContacts = async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ });
//   const user = await UserModel.findOne({ userId: req.user?.userId });
//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   const isFreePlan = user.subscription.plan === 'free';
  const query = ContactModel.find({  }).sort({ createdAt: -1 });

//   if (isFreePlan) {
//     query.limit(5); // Free plan: only the 5 most recent contacts
//   }

  const contacts = await query.exec();
  res.json(contacts);
};

// Delete a contact
export const deleteContact = async (req: Request, res: Response) => {
  const { contactId } = req.params;

  const contact = await ContactModel.findOneAndDelete({ contactId });
//   const contact = await ContactModel.findOneAndDelete({ contactId, userId: req.user?.userId });
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found or you do not have permission to delete it' });
  }

  res.status(204).send();
};