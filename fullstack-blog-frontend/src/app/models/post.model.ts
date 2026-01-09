export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  user_id: string;
  image: string;
  published_at:string;
  created_at?: string;
  updated_at?: string;
}