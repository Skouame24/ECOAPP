import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { IUser } from './interfaces/user.interface';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<IUser | null>;
    login(user: IUser): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            type: import(".prisma/client").$Enums.UserType;
            category: import(".prisma/client").$Enums.PointCategory;
            latitude: any;
            longitude: any;
        };
    }>;
}
