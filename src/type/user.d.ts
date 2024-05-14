export type User = {
  user_id: string;
  email: string;
  user_name: string;
  img: string;
};

export type GetUserListRes = {
  data: User[];
};
