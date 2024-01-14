import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { v4 } from 'uuid';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: 'src/users/uploads',
      serveRoot: '/uploads',
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: 'src/users/uploads',
        filename: (req: Request, file: Express.Multer.File, cb) => {
          const ext = file.mimetype.split('/')[1];
          const filename: string = `users-${v4()}.${ext}`;
          cb(null, filename);
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
