import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { GetUserQuery } from '../../application/queries/get-user.query';
import { User } from '../../domain/models/user.model';
import { CreateUserDto } from '../../domain/dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<User> {
    return this.queryBus.execute(new GetUserQuery(userId));
  }
}
