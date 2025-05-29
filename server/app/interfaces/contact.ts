export interface Contact {
  contactId: string;
  userId: string; // The user who owns this contact
  name: string; // Contact's name
  email?: string; // Contact's email
  phone?: string; // Contact's phone
  company?: string; // Contact's company
  jobTitle?: string; // Contact's job title
  notes?: string; // Optional notes
  sourceCardId?: string; // The card that led to this contact (optional)
  createdAt: Date;
  updatedAt: Date;
}