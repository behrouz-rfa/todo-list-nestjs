import { UpdateTodoItemDto } from '../../domain/dtos/update-todo-item.dto';

export class UpdateTodoItemCommand {
  constructor(
    public readonly todoListId: string,
    public readonly todoItemId: string,
    public readonly updateTodoItemDto: UpdateTodoItemDto,
  ) {}
}
