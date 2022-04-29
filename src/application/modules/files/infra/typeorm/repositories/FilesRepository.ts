import { getRepository, Repository } from 'typeorm';

import { IFilesRepository } from '@application/modules/files/repositories/contracts/IFilesRepository';
import { IFile } from '@domain/entities/contracts/IFile';

import { File } from '../entities/File';

class FilesRepository implements IFilesRepository {
  private repository: Repository<File>;

  constructor() {
    this.repository = getRepository(File);
  }

  async upload(filename: string): Promise<IFile> {
    const file = this.repository.create({ filename });

    await this.repository.save(file);

    return file;
  }
}

export { FilesRepository };
