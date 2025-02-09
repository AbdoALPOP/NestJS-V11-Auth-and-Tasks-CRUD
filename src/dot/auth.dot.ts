import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthDot {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(25)
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
