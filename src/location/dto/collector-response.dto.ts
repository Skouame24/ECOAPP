import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export class CollectorResponseDto {
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

  @ApiProperty({ type: Number, nullable: true })
  latitude: number | null;

  @ApiProperty({ type: Number, nullable: true })
  longitude: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  distance: number;
}