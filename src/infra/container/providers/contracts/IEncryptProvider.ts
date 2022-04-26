interface IEncryptProvider {
  hash(password: string, salt?: number): Promise<string>;
  compare(password: string, password_hash: string): Promise<boolean>;
}

export { IEncryptProvider };
