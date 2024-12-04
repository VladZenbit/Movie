import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserProfileDto } from '../dto/user-profile.dto';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UserProfileDto => {
    const request = ctx.switchToHttp().getRequest();

    return {
      email: request.user.email,
      id: request.user.id,
      firstName: request.user.firstName,
      lastName: request.user.lastName,
    };
  },
);
