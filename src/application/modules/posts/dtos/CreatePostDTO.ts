interface ICreatePostRequestDTO {
  title: string;
  description: string;
  user_id: string;
  category_id: string;
}

interface ICreatePostResponseDTO {
  id: string;
  title: string;
  description: string;
  user_id: string;
  category_id: string;
  created_at: Date;
}

export { ICreatePostRequestDTO, ICreatePostResponseDTO };
