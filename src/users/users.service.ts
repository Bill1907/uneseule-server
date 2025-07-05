import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { OnboardingData } from 'src/types/user.types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(uuid: string) {
    const user = await this.usersRepository.findById(uuid);
    return user;
  }

  async updateUsers(uid: string, data: any) {
    return await this.usersRepository.update(uid, data);
  }

  async createUsers(uid: string, data: any) {
    const user = await this.usersRepository.findById(uid);
    if (user) {
      await this.usersRepository.update(uid, data);
      return await this.usersRepository.findById(uid);
    }
    await this.usersRepository.createWithId(uid, {
      uid,
      ...data,
    });
    return await this.usersRepository.findById(uid);
  }

  async createOnboarding(uid: string, data: OnboardingData) {
    const user = await this.usersRepository.findById(uid);
    if (user) {
      await this.usersRepository.update(uid, {
        onboardingData: data,
        isUpdatedOnboarding: true,
      });
    }
    return await this.usersRepository.findById(uid);
  }
}
