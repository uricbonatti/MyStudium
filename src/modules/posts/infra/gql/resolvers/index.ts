import {
  createPost,
  deletePost,
  getPost,
  listPosts,
  updatePost,
} from './PostsResolver';

export const PostQuerys = {
  getPost,
  listPosts,
};

export const PostMutations = {
  createPost,
  deletePost,
  updatePost,
};
