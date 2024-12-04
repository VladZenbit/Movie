import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

import { SignInUserDto } from './sign-in-user.dto';

export class SignUpUserDto extends SignInUserDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsString({ message: 'First name should be of type string' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @IsString({ message: 'Last name should be of type string' })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email address format' })
  email: string;
}
