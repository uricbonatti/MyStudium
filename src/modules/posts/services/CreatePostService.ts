import { injectable, inject } from 'tsyringe';
import removeAccents from 'remove-accents';
import { ApolloError } from 'apollo-server';
import { ObjectId as MongoObjectID } from 'mongodb';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ITagsRepository from '@modules/tags/repositories/ITagsRepository';
import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository';
import Tag from '@modules/tags/infra/typeorm/schemas/Tag';
import IPostsRepository from '../repositories/IPostsRepository';
import Post from '../infra/typeorm/schemas/Post';

interface ICreatePostDTO {
  author_id: string;
  body: string;
  resume: string;
  category_id: string;
  image_url: string;
  tag_ids: { tag_id: string }[];
  title: string;
}

@injectable()
class CreatePostService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('TagsRepository')
    private tagsRepository: ITagsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute({
    author_id,
    body,
    category_id,
    image_url,
    resume,
    tag_ids,
    title,
  }: ICreatePostDTO): Promise<Post> {
    const user = await this.usersRepository.findById(author_id);
    if (!user) {
      throw new ApolloError('Author/User not found.', '400');
    }
    const slug = removeAccents(title).toLowerCase().replace(' ', '-');
    const checkSlugExist = await this.postsRepository.findBySlug(slug);

    const checkAuthorSlugExists = checkSlugExist.filter(postFind =>
      postFind.author.id.equals(new MongoObjectID(author_id)),
    );
    if (checkAuthorSlugExists.length > 0) {
      throw new ApolloError(
        'Author already have a Post with same title',
        '400',
      );
    }

    if (!MongoObjectID.isValid(category_id)) {
      throw new ApolloError('Category ID is invalid.', '400');
    }

    const category = await this.categoriesRepository.findById(category_id);
    if (!category) {
      throw new ApolloError('Category dont exist.', '400');
    }
    const extractedTagIds = tag_ids.map(tag => tag.tag_id);
    const stokedTags: Tag[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const tag_id of extractedTagIds) {
      if (!MongoObjectID.isValid(tag_id)) {
        throw new ApolloError('Tag ID is invalid.', '400');
      }
      // eslint-disable-next-line no-await-in-loop
      const tag = await this.tagsRepository.findById(tag_id);
      if (!tag) {
        throw new ApolloError('Tag dont exist.', '400');
      }
      stokedTags.push(tag);
    }
    const post = await this.postsRepository.create({
      author: user,
      body,
      slug,
      resume,
      category,
      image_url,
      tags: stokedTags,
      title,
    });

    await this.postsRepository.save(post);

    return post;
  }
}

export default CreatePostService;
