/**
 * Represents a user object returned by the Clerk API.
 */
export interface ClerkUserAPI {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  image_url: string | null;
  profile_image_url: string | null;
}

export interface ClerkUsersResponse {
  data: ClerkUserAPI[];
  total_count: number;
}
