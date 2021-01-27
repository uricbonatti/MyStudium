import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId as MongoObjectID } from 'mongodb';

@Entity('comment_reports')
class CommentReport {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  comment_id: MongoObjectID;

  @Column()
  user_id: MongoObjectID;

  @Column()
  moderator_id: MongoObjectID;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  feedback: string;

  @Column()
  closed: boolean;

  @Column()
  action: 'deleted' | 'nothing';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
export default CommentReport;
