import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadFileUseCase } from './UploadFileUseCase';

class UploadFileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filename } = request.file;

    const uploadFileUseCase = container.resolve(UploadFileUseCase);

    const file = await uploadFileUseCase.execute(filename);

    return response.status(201).json(file);
  }
}

export { UploadFileController };
