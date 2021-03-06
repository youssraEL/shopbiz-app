import { Comment } from './comment';

export class Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  featured: boolean;
  description: string;
  imageUrl: string;
  price: number;
  active: boolean;
  lastUpdated: string;
  comments: Comment[];
}
