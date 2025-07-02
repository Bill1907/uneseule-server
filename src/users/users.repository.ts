import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../firebase/base.repository.js';
import { User } from '../types/index.js';
import { COLLECTIONS } from '../types/collections.js';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  protected collectionName = COLLECTIONS.USERS;

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findByField('email', email);
    return users.length > 0 ? users[0] : null;
  }

  async createUser(user: User): Promise<string> {
    return await this.create(user);
  }

  async createUserWithId(uid: string, user: User): Promise<string> {
    return await this.createWithId(uid, user);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.update(userId, { lastLoginAt: new Date() });
  }

  async updateOnboardingData(
    userId: string,
    onboardingData: User['onboardingData'],
  ): Promise<void> {
    await this.update(userId, { onboardingData });
  }

  async updateSettings(
    userId: string,
    settings: Partial<User['settings']>,
  ): Promise<void> {
    const currentUser = await this.findById(userId);
    if (currentUser) {
      const updatedSettings = { ...currentUser.settings, ...settings };
      await this.update(userId, { settings: updatedSettings });
    }
  }

  async updateProfile(
    userId: string,
    profileData: Partial<Pick<User, 'displayName' | 'profileImageUrl'>>,
  ): Promise<void> {
    await this.update(userId, profileData);
  }

  async incrementVersion(userId: string): Promise<void> {
    const currentUser = await this.findById(userId);
    if (currentUser) {
      await this.update(userId, { version: currentUser.version + 1 });
    }
  }

  async findUsersWithInterest(interest: string): Promise<User[]> {
    // Firestore array-contains 쿼리 사용
    const snapshot = await this.collection
      .where('onboardingData.learningInterests', 'array-contains', interest)
      .get();
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as User);
  }

  async findUsersByAgeGroup(ageGroup: string): Promise<User[]> {
    const snapshot = await this.collection
      .where('onboardingData.ageGroup', '==', ageGroup)
      .get();
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as User);
  }
}
