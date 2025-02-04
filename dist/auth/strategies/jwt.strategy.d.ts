import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserType } from '@prisma/client';
interface JwtPayload {
    email: string;
    sub: string;
    type: UserType;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        sub: string;
        email: string;
        type: import(".prisma/client").$Enums.UserType;
    }>;
}
export {};
