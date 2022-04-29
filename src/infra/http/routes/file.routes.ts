import { Router } from 'express';
import multer from 'multer';

import { UploadFileController } from '@application/modules/files/useCases/uploadFile/UploadFileController';
import uploadConfig from '@infra/shared/config/upload';
import ensureAuthenticate from '../middlewares/ensureAuthenticate';

const filesRoutes = Router();
const uploadFileController = new UploadFileController();

const upload = multer(uploadConfig.upload('./tmp/images/'));

filesRoutes.post(
  '/upload',
  ensureAuthenticate,
  upload.single('file'),
  uploadFileController.handle,
);

export { filesRoutes };
