import { compare, hash } from 'bcrypt';
import { IEncryptProvider } from '../contracts/IEncryptProvider';

class BcryptProvider implements IEncryptProvider {
  async hash(password: string, salt: number): Promise<string> {
    const passwordHash = await hash(password, salt);
    return passwordHash;
  }

  async compare(password: string, password_hash: string): Promise<boolean> {
    const isPasswordMatch = await compare(password, password_hash);
    return isPasswordMatch;
  }
}

export { BcryptProvider };
