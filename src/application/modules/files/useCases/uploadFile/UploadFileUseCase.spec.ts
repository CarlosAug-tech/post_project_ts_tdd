import { FilesRepositoryInMemory } from '../../repositories/in-memory/FilesRepositoryInMemory';
import { UploadFileUseCase } from './UploadFileUseCase';

let filesRepositoryInMemory: FilesRepositoryInMemory;
let uploadFileUseCase: UploadFileUseCase;

describe('upload File UseCase', () => {
  beforeAll(() => {
    filesRepositoryInMemory = new FilesRepositoryInMemory();
    uploadFileUseCase = new UploadFileUseCase(filesRepositoryInMemory);
  });

  it('should be able to upload a new File', async () => {
    const file = {
      filename: 'any_file.png',
    };

    const newFile = await uploadFileUseCase.execute(file.filename);

    expect(newFile).toHaveProperty('id');
  });
});
