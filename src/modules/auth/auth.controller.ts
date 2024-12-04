import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ApiNamedException } from 'src/common/decorators/named-api-exception.decorator';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorators';
import { AccessTokenDto } from './dto/access-token.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { userWithEmailAlreadyExistExceptionsSample } from './exceptions/user-with-email-already-exist.exception';
import { userWithEmailNotFoundExceptionSample } from './exceptions/user-with-this-email-not-found.exception';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('sign-in')
  @ApiOkResponse({ description: 'Sign in user', type: SignInUserDto })
  @ApiNamedException(() => [userWithEmailNotFoundExceptionSample])
  async signInUser(@Body() signInBody: SignInUserDto): Promise<AccessTokenDto> {
    return this.authService.signInUser(signInBody);
  }

  @Post('sign-up')
  @ApiOkResponse({ description: 'Sign up user', type: AccessTokenDto })
  @ApiNamedException(() => [userWithEmailAlreadyExistExceptionsSample])
  async register(@Body() registerBody: SignUpUserDto): Promise<AccessTokenDto> {
    return this.authService.signUpUser(registerBody);
  }
}
