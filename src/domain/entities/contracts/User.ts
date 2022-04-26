interface IUser {
  id: string;

  name: string;

  email: string;

  password: string;

  isAdmin: boolean;

  created_at: Date;
}

export { IUser };
