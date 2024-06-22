import { ICommand } from '@nestjs/cqrs';
import { CreateUserDto } from '../../domain/dtos/create-user.dto';

export class CreateUserCommand implements ICommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}
