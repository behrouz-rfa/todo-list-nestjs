import { CreateTodoItemDto } from '../../domain/dtos/create-todo-item.dto';

export class CreateTodoItemCommand {
  constructor(
    public readonly todoListId: string,
    public readonly createTodoItemDto: CreateTodoItemDto,
  ) {}
}
