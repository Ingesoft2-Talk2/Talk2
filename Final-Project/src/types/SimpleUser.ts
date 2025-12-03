/**
 * Represents a simplified user object used within the application.
 */
export interface SimpleUser {
  id: string;
  name: string;
  username: string | null;
  friend_status?: string;
  image: string | null;
}
