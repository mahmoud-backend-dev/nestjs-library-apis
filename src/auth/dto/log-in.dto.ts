import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: 'email is required and must be valid email' })
  email: string;

  @IsString({ message: 'name is required and must be string' })
  password: string;
}