import { BadRequestException, ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/log-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { MailService } from 'src/mail/mail.service';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private userService:UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }
  
  async signup(signUpDto: SignUpDto): Promise<object> {
    const userExist = await this.userRepo.findOneBy({email:signUpDto.email});
    if (userExist && userExist.verifiedEmail === true){
      throw new ForbiddenException('This email used')
    }
    if (userExist && userExist.expiredConfirmEmail > new Date(Date.now()))
      throw new ForbiddenException(
        'Please confirm your email that token not expired',
      );
    signUpDto.password = await bcrypt.hash(signUpDto.password, 10);
    const expiredConfirmEmail = new Date(Date.now() + 60 *  1000);
    const token = this.jwtService.sign({ email: signUpDto.email }, { expiresIn: '60s' });
    const url = `${process.env.FRONTEND_URL}/auth/confirm-email/${token}`;
    try {
      await this.mailService.sendUserConfirmation(signUpDto.email, signUpDto.name, url);
      if (userExist) {
        await this.userRepo
          .createQueryBuilder()
          .update(User)
          .set({ ...signUpDto, expiredConfirmEmail })
          .where('email = :email', { email: signUpDto.email })
          .execute();
        return { message: 'Please check your email' }
      }
      await this.userRepo.save({ ...signUpDto, expiredConfirmEmail });
      return { message: 'Please check your email' }
    } catch (error) {
      await this.userRepo.delete({ email: signUpDto.email });
      throw new HttpException(error, 500)
    }
  }

  async login(loginDto: LoginDto): Promise<object> {
    const user = await this.userRepo.findOne(
      {
        where: { email: loginDto.email },
        select: ['id', 'name', 'email', 'password'],
      }
    );
    if (!user || !await bcrypt.compare(loginDto.password, user.password))
      throw new BadRequestException('Invalid Credentials');
    const { password, ...result } = user;
    const token = this.jwtService.sign({ id: user.id });
    return { user: result, token };
  }
}
