export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  thumbnail_url?: string;
  excerpt?: string;
  category_id: string;
  user_id: string;
  featured_image_url?: string;
  created_at?: string;
  updated_at?: string;
}