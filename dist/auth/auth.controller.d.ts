import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { IUser } from './interfaces/user.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, user: IUser): Promise<{
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
    getProfile(user: IUser): IUser;
}
