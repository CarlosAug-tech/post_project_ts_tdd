interface ICreateCommentRequestDTO {
  content: string;
  user_id: string;
  post_id: string;
}

interface ICreateCommentResponseDTO {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: Date;
}

export { ICreateCommentRequestDTO, ICreateCommentResponseDTO };
