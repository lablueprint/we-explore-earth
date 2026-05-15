import { RSVPStatus } from './event';

export interface UserRSVP {
  eventID: string;
  status: RSVPStatus;
}

export interface NewUser {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin: boolean;
  events: UserRSVP[];
  avatar: string | null;
  hasOnboarded: boolean;
  notificationsEnabled: boolean;
}

export interface User extends NewUser {
  id: string;
}