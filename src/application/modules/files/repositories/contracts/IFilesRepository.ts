import { IFile } from '@domain/entities/contracts/IFile';

interface IFilesRepository {
  upload(filename: string): Promise<IFile>;
}

export { IFilesRepository };
