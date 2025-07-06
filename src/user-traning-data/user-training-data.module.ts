import { Module } from '@nestjs/common';
import { UserTrainingDataController } from './user-training-data.controller';
import { UserTrainingDataRepository } from './user-training-data.repository';
import { UserTrainingDataService } from './user-training-data.service';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  controllers: [UserTrainingDataController],
  providers: [UserTrainingDataService, UserTrainingDataRepository],
  imports: [FirebaseModule],
  exports: [UserTrainingDataService, UserTrainingDataRepository],
})
export class UserTrainingDataModule {}
