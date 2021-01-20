import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
  ObjectID,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  description: string;

  @Column('int')
  @Exclude()
  fullexp: number;

  @Column()
  avatar_url: string;

  @Column()
  github: string;

  @Column()
  linkedin: string;

  @Column()
  permission: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'level' })
  getLvl(): number {
    if (this.fullexp < 1000) {
      return 0;
    }
    if (this.fullexp < 2000) {
      return 1;
    }
    let base1 = 1000;
    let base2 = 2000;
    let levelCont = 1;
    while (true) {
      base1 += base2;
      levelCont += 1;
      if (this.fullexp < base1) {
        break;
      }
      base2 += base1;
      levelCont += 1;
      if (this.fullexp < base2) {
        break;
      }
    }
    return levelCont;
  }

  @Expose({ name: 'exp_percent' })
  getExp(): number {
    if (this.fullexp < 1000) {
      return (this.fullexp / 1000) * 100;
    }
    if (this.fullexp < 2000) {
      return ((this.fullexp - 1000) / 1000) * 100;
    }
    if (this.fullexp < 3000) {
      return ((this.fullexp - 2000) / 1000) * 100;
    }

    let base1 = 2000;
    let base2 = 3000;
    let base3 = 5000;
    let aux = 0;
    while (true) {
      if (this.fullexp < base3) {
        return ((this.fullexp - base2) / base1) * 100;
      }
      base1 = base2 + 0;
      aux = base3 + 0;
      base3 = base2 + base3;
      base2 = aux + 0;
    }
  }

  @Expose({ name: 'access_level' })
  getPermission(): 'admin' | 'moderator' | 'user' {
    switch (this.permission) {
      case 0:
        return 'admin';
      case 1:
        return 'moderator';
      default:
        return 'user';
    }
  }
}

export default User;
