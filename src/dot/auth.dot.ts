import {
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
  @MaxLength(15)
  username: string;
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
