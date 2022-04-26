interface IComment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: Date;
}

export { IComment };
