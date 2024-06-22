import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDocument } from '../../infrastructure/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    const savecreatedUser = await createdUser.save();
    return this.mapUserDocumentToModel(savecreatedUser);
  }

  async findUserById(userId: string): Promise<User> {
    const userDoce = await this.userModel.findById(userId).exec();
    if (!userDoce) {
      throw new NotFoundException('User not found');
    }
    return this.mapUserDocumentToModel(userDoce);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      return null;
    }
    return this.mapUserDocumentToModel(user);
  }
  private mapUserDocumentToModel(document: UserDocument): User {
    return {
      id: document._id.toString(),
      username: document.username,
      todoLists: document.todoLists,
      password: document.password,
    };
  }
}
