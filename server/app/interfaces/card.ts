export interface Card {
  cardId: string;
  userId: string;
  title: string;
  links: { type: string; url: string }[];
  createdAt: Date;
  updatedAt: Date;
  shareableLink?: {
    url: string; 
    isActive: boolean;
    expiresAt?: Date;
  };
}