import { IComment } from '@domain/entities/contracts/IComment';
import { v4 } from 'uuid';

class Comment implements IComment {
  id: string;

  content: string;

  user_id: string;

  post_id: string;

  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}

export { Comment };
