import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId as MongoObjectID } from 'mongodb';
import Tag from '@modules/tags/infra/typeorm/schemas/Tag';
import Category from '@modules/categories/infra/typeorm/schemas/Category';
import { OmitedUser } from '@shared/utils/interfaces';
import { Expose } from 'class-transformer';

@Entity('posts')
class Post {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  title: string;

  @Column()
  image_url: string;

  @Column()
  resume: string;

  @Column()
  body: string;

  @Column()
  author: OmitedUser;

  @Column()
  users_liked: MongoObjectID[];

  @Column()
  category: Category;

  @Column()
  tags: Tag[];

  @Column()
  slug: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'likes' })
  getLikes(): number {
    if (this.users_liked && this.users_liked.length > 0) {
      console.log(this.users_liked.length);
      return this.users_liked.length;
    }
    return 0;
  }
}

export default Post;
