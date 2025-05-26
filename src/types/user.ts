export type UserType = 'provider' | 'client' | 'admin';

export interface User {
  id: string;
  email: string | null;
  phone: string;
  username: string;
  user_type: UserType;
  display_name?: string; // Add this line for display_name
  email_verified: boolean;
  phone_verified: boolean;
  last_username_change?: Date;
  user_metadata?: {
    display_name?: string; // Include display_name here
    username?: string;
    role?: UserType;
    // Add further metadata properties if required
  };
}