import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
} from 'typeorm';
import Category from '@modules/categories/infra/typeorm/schemas/Category';

@Entity('tags')
class Tag {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  category: Category;

  @CreateDateColumn()
  created_at: Date;
}
export default Tag;
