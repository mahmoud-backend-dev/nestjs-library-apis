import { BadRequestException, Controller, Get, ParseFilePipeBuilder, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(
    @CurrentUser()
    user: User,
  ): Promise<User> {
    return await this.usersService.getMe(user.id);
  }

  @Post('/upload/image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @CurrentUser()
    user: User,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({fileType:'image'}).build({
      fileIsRequired: true,
      exceptionFactory: ()=> new BadRequestException('Image is required and must be an image')
    }))
    image:Express.Multer.File,
  ): Promise<User> {
    return await this.usersService.uploadImage(user.id, image.filename);
  }
}
