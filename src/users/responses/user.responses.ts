import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { UserProfile, UserLocation, UserLocationHistory } from '../types/user.types';

export class UserResponse implements Partial<UserProfile> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ enum: UserType })
  type: UserType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false, nullable: true })
  latitude?: number | null;

  @ApiProperty({ required: false, nullable: true })
  longitude?: number | null;
}

export class UserLocationResponse implements UserLocation {
  @ApiProperty()
  id: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  updatedAt: Date;
}

export class UserLocationHistoryResponse implements UserLocationHistory {
  @ApiProperty()
  id: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  createdAt: Date;
}