import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user || undefined;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateProfile(id: number, profile: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      user.profile = profile;
      return this.usersRepository.save(user);
    }
    throw new Error('User not found');
  }

  async create(user: Partial<User>): Promise<User> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(user.passwordHash || '', saltOrRounds);
    user.passwordHash = hash;
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }
}
