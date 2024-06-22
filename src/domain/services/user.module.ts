import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../infrastructure/schemas/user.schema';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
