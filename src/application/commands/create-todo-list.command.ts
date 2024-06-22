import { ICommand } from '@nestjs/cqrs';
import { CreateTodoListDto } from '../../domain/dtos/create-todo-list.dto';

export class CreateTodoListCommand implements ICommand {
  constructor(public readonly createTodoListDto: CreateTodoListDto) {}
}
