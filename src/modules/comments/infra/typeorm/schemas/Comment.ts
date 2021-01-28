import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ObjectId as MongoObjectID } from 'mongodb';
import { OmitedUser } from '@shared/utils/interfaces';
import { Expose } from 'class-transformer';

@Entity('comments')
class Comment {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  body: string;

  @Column()
  author: OmitedUser;

  @Column()
  post_id: MongoObjectID;

  @Column()
  users_liked: MongoObjectID[];

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

  @BeforeInsert()
  solveBinaryBug() {
    this.post_id = new MongoObjectID(this.post_id);
    this.users_liked = [];
  }

  @BeforeUpdate()
  solveBinaryBugAgain() {
    this.post_id = new MongoObjectID(this.post_id);
  }
}

export default Comment;
