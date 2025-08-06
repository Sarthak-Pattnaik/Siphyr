export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
  };
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
}
