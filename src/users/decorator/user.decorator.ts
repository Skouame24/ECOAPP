import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    if (!request.user) {
      return null;
    }

    // Create a complete user object with all properties
    const user = {
      ...request.user,
      id: request.user.sub, // Use sub as id from JWT
      sub: request.user.sub,
      email: request.user.email,
      firstName: request.user.firstName,
      lastName: request.user.lastName,
      phoneNumber: request.user.phoneNumber,
      type: request.user.type,
      category: request.user.category, // Add category field
      latitude: request.user.latitude,
      longitude: request.user.longitude,
      createdAt: request.user.createdAt,
      updatedAt: request.user.updatedAt
    };

    // If a specific property is requested
    if (data) {
      return user[data];
    }

    // Return the complete user object
    return user;
  },
);