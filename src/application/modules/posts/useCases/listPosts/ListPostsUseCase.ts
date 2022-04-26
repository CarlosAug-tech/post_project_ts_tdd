import { inject, injectable } from 'tsyringe';
import { IListPostsResponseDTO } from '../../dtos/ListPostsDTO';
import { IPostsRepository } from '../../repositories/contracts/IPostsRepository';

@injectable()
class ListPostsUseCase {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  async execute(): Promise<any[]> {
    const posts = await this.postsRepository.listAll();

    return posts;
  }
}

export { ListPostsUseCase };
