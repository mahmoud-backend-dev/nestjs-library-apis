import { Body, Controller, HttpException, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/log-in.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entity/user.entity';

@Controller({
  path: 'auth',
  version:'1'
})
export class AuthController {
  constructor(
    private authService:AuthService
  ) { }
  
  @Post('signup')
  async signup(
    @Body()
    signUpDto:SignUpDto
  ):Promise<object> {
    return await this.authService.signup(signUpDto)
  }

  @Post('confirm-email')
  @UseGuards(JwtAuthGuard)
  async confirmEmail(
    @CurrentUser()
    user:User
  ) {
    return { message: 'Email confirmed',user }
  }

  @Post('login')
  async login(
    @Body()
    loginDto:LoginDto
  ): Promise<object>{
    return await this.authService.login(loginDto);
  }
}
