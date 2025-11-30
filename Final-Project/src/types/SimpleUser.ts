export interface SimpleUser {
  id: string;
  name: string;
  username: string | null;
  friend_status?: string;
  image: string | null;
}
