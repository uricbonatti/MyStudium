import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('categories')
class Category {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;
}
export default Category;
