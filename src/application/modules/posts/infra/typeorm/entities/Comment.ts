import { User } from '@application/modules/accounts/infra/typeorm/entities/User';
import { IComment } from '@domain/entities/contracts/IComment';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 } from 'uuid';
import { Post } from './Post';

@Entity('comments')
class Comment implements IComment {
  @PrimaryColumn()
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column()
  post_id: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}

export { Comment };
