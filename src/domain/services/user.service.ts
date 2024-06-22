import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { EventBus } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../../application/events/user-created.event';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.createUser(createUserDto);
    this.eventBus.publish(new UserCreatedEvent(newUser.id, newUser.username));
    return newUser;
  }

  async getUserById(userId: string): Promise<User> {
    return this.userRepository.findUserById(userId);
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findByUsername(username);
  }
}
