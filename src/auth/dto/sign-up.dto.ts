import { IsEmail, IsString, MinLength } from "class-validator";


export class SignUpDto{
  @IsString({ message: 'name is required and must be string' })
  name: string;
  
  @IsEmail({}, { message: 'email is required and must be valid email' })
  email: string;

  @IsString({ message: 'name is required and must be string' })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password: string;
}