import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    console.log('User from request:', user);  // Log pour vérifier les informations de l'utilisateur

    return data ? user?.[data] : user;
  },
);
