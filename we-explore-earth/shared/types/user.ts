import { RSVPStatus } from './event';

export interface UserRSVP {
  eventID: string;
  status: RSVPStatus;
}

export interface NewUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  notificationToken: string | null;
  isAdmin: boolean;
  events: UserRSVP[];
  hasOnboarded: boolean;
}

export interface User extends NewUser {
  id: string;
}
