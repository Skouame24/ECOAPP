import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    if (!request.user) {
      return null;
    }

    // Create a consistent user object that includes both JWT and user info
    const user = {
      ...request.user,
      id: request.user.sub, // Use sub as id from JWT
      sub: request.user.sub,
      email: request.user.email,
      type: request.user.type
    };

    // If a specific property is requested
    if (data) {
      return user[data];
    }

    // Return the complete user object
    return user;
  },
);