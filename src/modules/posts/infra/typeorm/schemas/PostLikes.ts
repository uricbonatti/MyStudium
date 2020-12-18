import { Expose } from 'class-transformer';
import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';

import { ObjectId as MongoObjectID } from 'mongodb';

@Entity('post_likes')
class PostLikes {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  post_id: MongoObjectID;

  @Column()
  user_liked: MongoObjectID[];

  @Expose({ name: 'likes' })
  getLikes(): number {
    return this.user_liked.length;
  }
}
export default PostLikes;
