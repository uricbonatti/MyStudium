import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';
import { ObjectID as MongoObjectId } from 'mongodb';

@Entity('user_tokens')
class UserToken {
  @ObjectIdColumn()
  id: ObjectID;

  @Column('uuid')
  @Generated('uuid')
  token: string;

  @Column()
  user_id: MongoObjectId;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
export default UserToken;
