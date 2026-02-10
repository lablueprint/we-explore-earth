export interface UserRSVP {
  eventID: string;
  status: string;
}

export interface NewUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  notificationToken: string | null;
  wantsNotifications: boolean;
  isAdmin: boolean;
  events: UserRSVP[];
}

export interface User extends NewUser {
  id: string; 
}