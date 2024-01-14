import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User> 
  ) { }

  async emailExist(email: string): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { email: email } })
    if (!user) return false
    return true
  }

  async create(user: User): Promise<User> {
    return await this.userRepo.create(user)
  }

  async deleteOne(id:string): Promise<boolean> {
    return await this.userRepo.delete(id) ? true : false
  }

  async getMe(id:string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    return user
  }

  async uploadImage(id: string, image: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id })
    if(user.image) await unlink(`src/users/uploads/${user.image.split('/').pop()}`)
    user.image = `${process.env.BASE_URL}/uploads/${image}`;
    return await this.userRepo.save(user)
  }
}
