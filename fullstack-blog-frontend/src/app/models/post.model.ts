export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category_id: string;
  user_id: string;
  featured_image_url?: string;
  published_at:string;
  created_at?: string;
  updated_at?: string;
}