import { PointCategory, UserType } from '@prisma/client';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: UserType;
  category:PointCategory
}