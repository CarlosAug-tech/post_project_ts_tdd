import { IFile } from '@domain/entities/contracts/IFile';
import { inject, injectable } from 'tsyringe';
import { IFilesRepository } from '../../repositories/contracts/IFilesRepository';

@injectable()
class UploadFileUseCase {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) {}

  async execute(filename: string): Promise<IFile> {
    const file = await this.filesRepository.upload(filename);

    return file;
  }
}

export { UploadFileUseCase };
