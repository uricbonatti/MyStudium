import { gql } from 'apollo-server';

const Schema = gql`
  scalar Date
  input TagFilter {
    category_id: String
  }
  input PostFilter {
    category_id: ID
    part_of_title: String
    author_id: String
  }
  input CreateCategory {
    name: String!
  }
  input CreateTag {
    name: String!
    category_id: String!
  }
  input CreateComment {
    post_id: String!
    body: String!
  }
  input UpdateComment {
    comment_id: String!
    body: String!
  }
  input CreatePost {
    title: String!
    image_url: String
    body: String!
    category_id: String!
    tag_ids: [CreatePostTag]
  }
  input CreatePostTag {
    tag_id: String!
  }
  input UpdatePost {
    title: String
    image_url: String
    body: String
    category_id: String
    tag_id: [String]
  }
  input CreateUser {
    email: String!
    name: String!
    description: String
    password: String!
    github: String
    linkedin: String
  }

  input UpdateUser {
    email: String
    name: String
    password: String
    description: String
    old_password: String
    github: String
    linkedin: String
    avatar_url: String
  }
  input DeleteUser {
    email: String!
  }
  input LoginData {
    email: String!
    password: String!
  }
  type User {
    id: String
    name: String!
    email: String!
    description: String
    avatar_url: String
    github: String
    linkedin: String
    created_at: Date!
    updated_at: Date!
    level: Int!
    exp_percent: Float!
  }
  type AuthenticateUser {
    token: String!
    user: User!
  }
  type Author {
    id: String!
    nome: String!
    avatar_url: String
  }

  type Comment {
    id: String
    author: Author!
    creation_at: Date!
    updated_at: Date!
    body: String!
    post_id: String!
  }
  type Tag {
    id: String
    name: String!
    category: Category!
  }
  type Category {
    id: String
    name: String!
  }
  type Post {
    id: String
    author: Author!
    title: String!
    image_url: String
    body: String!
    category: Category
    created_at: Date!
    updated_at: Date!
    comments: [Comment]
    tags: [Tag]
  }
  type UserActivity {
    postsLiked: Int
    postsCreated: Int
    commentsLiked: Int
    commentsCreated: Int
  }
  type UserSummary {
    all: UserActivity
    lastMonth: UserActivity
    lastWeek: UserActivity
    weekExp: Int
    lastWeekPosts: [Post]
  }
  type Query {
    getUser(id: String!): User
    getPost(id: String): Post!
    getTag(id: ID): Tag
    listPosts(filter: PostFilter): [Post]
    listCategories(id: String): [Category]
    listTags(filter: TagFilter): [Tag]
    login(data: LoginData): AuthenticateUser
    userSummary(id: ID!): UserSummary
  }
  type Mutation {
    likePost(post_id: ID): Int
    likeComment(comment_Id: String): Int
    createUser(data: CreateUser): User
    updateUser(data: UpdateUser): User
    deleteUser(data: DeleteUser): ID
    createPost(data: CreatePost): Post!
    updatePost(id: String, data: UpdatePost): Post
    deletePost(id: String): String
    createComment(data: CreateComment): Comment!
    updateComment(id: String, data: UpdateComment): Comment
    deleteComment(id: String): String
    createCategory(data: CreateCategory): Category
    createTag(data: CreateTag): Tag
  }
`;

export default Schema;
