export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  notificationToken: string | null;
  wantsNotifications: boolean;
  isAdmin: boolean;
}
