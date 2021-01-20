import Post from '@modules/posts/infra/typeorm/schemas/Post'
import Comment from '@modules/comments/infra/typeorm/schemas/Comment'
import { ObjectId } from 'mongodb'

export interface IContext {
  token: string;
}

export interface FullTag {
  id: string;
  name: string;
  category: {
    id?: string;
    name?: string;
  };
}

export interface FullComment {
  id: string;
  post_id: string;
  body: string;
  author: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  likes: number;
  created_at: Date;
}

export interface FullPost {
  id: string;
  title: string;
  body: string;
  image_url: string;
  slug: string;
  category: {
    id: string;
    name: string;
  };
  tags: FullTag[];
  author: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  comments: FullComment[];
  likes: number;
  created_at: Date;
}

export interface FullUser {
  id: string;
  name: string;
  email: string;
  description?: string;
  github?: string;
  linkedin?: string;
  avatar_url: string;
  interactions: {
    posts: Post[];
    comments: Comment[];
  };
  exp_percent: number;
  level: number;
}

export interface OmitedUser {
  id: ObjectId;
  name: string;
  avatar_url: string;
}
