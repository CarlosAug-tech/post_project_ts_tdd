interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
}

interface ICreateUserResponseDTO {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export { ICreateUserDTO, ICreateUserResponseDTO };
