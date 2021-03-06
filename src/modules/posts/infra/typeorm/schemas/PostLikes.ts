import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { ObjectId as MongoObjectID } from 'mongodb';

@Entity('post_likes')
class PostLikes {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  post_id: MongoObjectID;

  @Column()
  users_liked: MongoObjectID[];

  @CreateDateColumn()
  created_at: Date;
}
export default PostLikes;
