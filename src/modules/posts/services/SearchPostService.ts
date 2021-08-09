import { inject, injectable } from 'tsyringe';
import { ObjectId as MongoObjectID } from 'mongodb';
import { ApolloError } from 'apollo-server';
import IPostsRepository from '../repositories/IPostsRepository';
import Post from '../infra/typeorm/schemas/Post';

interface ISearch {
  title?: string;
  author_id?: string;
  category_id?: string;
}

@injectable()
class SearchPostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository, // Anexar tag repository e category repository
  ) {}

  public async execute({
    title,
    author_id,
    category_id,
  }: ISearch): Promise<Post[]> {
    if (author_id && !MongoObjectID.isValid(author_id)) {
      throw new ApolloError('Invalid Author ID', '400');
    }
    if (category_id && !MongoObjectID.isValid(category_id)) {
      throw new ApolloError('Invalid Category ID', '400');
    }
    if (author_id && category_id && title) {
      const titlePosts = await this.postsRepository.findByTitle(title);
      const authorPosts = titlePosts.filter(post =>
        post.author.id.equals(new MongoObjectID(author_id)),
      );

      return authorPosts.filter(post =>
        MongoObjectID.createFromHexString(category_id).equals(post.category.id),
      );
    }

    if (category_id && title) {
      const titlePosts = await this.postsRepository.findByTitle(title);
      return titlePosts.filter(post =>
        MongoObjectID.createFromHexString(category_id).equals(post.category.id),
      );
    }

    if (author_id && title) {
      const titlePosts = await this.postsRepository.findByTitle(title);
      return titlePosts.filter(post =>
        post.author.id.equals(new MongoObjectID(author_id)),
      );
    }

    if (author_id && category_id) {
      const authorPosts = await this.postsRepository.findByAuthor(
        new MongoObjectID(author_id),
      );
      return authorPosts.filter(post =>
        MongoObjectID.createFromHexString(category_id).equals(post.category.id),
      );
    }

    if (category_id) {
      return this.postsRepository.findByCategory(
        new MongoObjectID(category_id),
      );
    }

    if (title) {
      return this.postsRepository.findByTitle(title);
    }

    if (author_id) {
      return this.postsRepository.findByAuthor(new MongoObjectID(author_id));
    }

    return this.postsRepository.findAll();
  }
}
export default SearchPostService;
