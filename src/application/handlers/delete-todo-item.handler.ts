import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTodoItemCommand } from '../commands/delete-todo-item.command';
import { TodoItemRepository } from '../../domain/repositories/todo-item.repository';

@CommandHandler(DeleteTodoItemCommand)
export class DeleteTodoItemHandler
  implements ICommandHandler<DeleteTodoItemCommand>
{
  constructor(private readonly repository: TodoItemRepository) {}

  async execute(command: DeleteTodoItemCommand): Promise<any> {
    const { todoListId, todoItemId } = command;
    return this.repository.deleteTodoItem(todoListId, todoItemId);
  }
}
