export type Task = {
  task_id: number;
  user_id: number;
  user_name: string;
  user_img: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
};

export type TaskGroup = {
  name: string;
  order_num: number;
  taskgroup_id: number;
  tasks: Task[];
};
