import { injectable, inject } from 'tsyringe';

import { ApolloError } from 'apollo-server';
import { ObjectId as MongoObjectID } from 'mongodb';
import removeAccents from 'remove-accents';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ITagsRepository from '@modules/tags/repositories/ITagsRepository';
import Tag from '@modules/tags/infra/typeorm/schemas/Tag';
import IPostsRepository from '../repositories/IPostsRepository';
import Post from '../infra/typeorm/schemas/Post';

interface ITagId {
  tag_id: string;
}

interface IUpdatePostDTO {
  post_id: string;
  user_id: string;
  body?: string;
  image_url?: string;
  tag_ids?: ITagId[];
  title?: string;
}

@injectable()
class UpdatePostService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('TagsRepository')
    private tagsRepository: ITagsRepository,
  ) {}

  public async execute({
    user_id,
    post_id,
    body,
    image_url,
    tag_ids,
    title,
  }: IUpdatePostDTO): Promise<Post> {
    const checkUserExists = await this.usersRepository.findById(user_id);
    if (!checkUserExists) {
      throw new ApolloError('User not found.', '400');
    }
    const post = await this.postsRepository.findByID(post_id);
    if (!post) {
      throw new ApolloError('Post not found.', '400');
    }
    if (!post.author.id.equals(checkUserExists.id)) {
      throw new ApolloError('User and Author not matched', '400');
    }
    if (title) {
      const slug = removeAccents(title).toLowerCase().replace(' ', '-');
      const checkSlugExist = await this.postsRepository.findBySlug(slug);
      const checkAuthorSlugExists = await checkSlugExist.filter(
        postFind =>
          postFind.author.id.equals(post.author.id) &&
          !postFind.id.equals(post.id),
      );

      if (checkAuthorSlugExists.length > 0) {
        throw new ApolloError(
          'Author already have a Post with same title',
          '400',
        );
      }
      post.title = title;
      post.slug = slug;
    }
    if (image_url) post.image_url = image_url;
    if (body) post.body = body;

    if (tag_ids) {
      const extractedTags = tag_ids.map(tag => tag.tag_id);
      const foundTags: Tag[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const extractedTag of extractedTags) {
        // eslint-disable-next-line no-await-in-loop
        const tag = await this.tagsRepository.findById(extractedTag);
        if (tag) {
          foundTags.push(tag);
        }
      }
      if (foundTags.length < tag_ids.length) {
        throw new ApolloError('Tag dont exist.', '400');
      }

      post.tags = [...foundTags];
    }

    const updatedPost = await this.postsRepository.save(post);
    return updatedPost;
  }
}
export default UpdatePostService;
