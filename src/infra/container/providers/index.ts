import { container } from 'tsyringe';
import { IEncryptProvider } from './contracts/IEncryptProvider';
import { BcryptProvider } from './implementations/BcryptProvider';

container.registerSingleton<IEncryptProvider>('BcryptProvider', BcryptProvider);
