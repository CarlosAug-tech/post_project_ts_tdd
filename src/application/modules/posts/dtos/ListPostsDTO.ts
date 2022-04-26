import { Post } from '../infra/typeorm/entities/Post';

interface IListPostsResponseDTO {
  post: Post[];
}

export { IListPostsResponseDTO };
