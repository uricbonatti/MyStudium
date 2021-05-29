import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { ObjectId as MongoObjectID } from 'mongodb';

@Entity('comment_likes')
class CommentLikes {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  comment_id: MongoObjectID;

  @Column()
  users_liked: MongoObjectID[];

  @CreateDateColumn()
  created_at: Date;
}
export default CommentLikes;
