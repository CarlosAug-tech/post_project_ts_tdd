import { IFile } from '@domain/entities/contracts/IFile';
import { File } from '../../infra/typeorm/entities/File';
import { IFilesRepository } from '../contracts/IFilesRepository';

class FilesRepositoryInMemory implements IFilesRepository {
  private file: File[] = [];

  async upload(filename: string): Promise<IFile> {
    const file = new File();

    Object.assign(file, {
      filename,
      created_at: new Date(),
    });

    this.file.push(file);

    return file;
  }
}

export { FilesRepositoryInMemory };
