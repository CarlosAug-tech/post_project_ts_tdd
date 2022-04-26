interface ICreateCategoryRequestDTO {
  name: string;
}

interface ICreateCategoryResponseDTO {
  id: string;
  name: string;
  created_at: Date;
}

export { ICreateCategoryRequestDTO, ICreateCategoryResponseDTO };
