import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTodoListCommand } from '../commands/delete-todo-list.command';
import { TodoListRepository } from '../../domain/repositories/todo-list.repository';

@CommandHandler(DeleteTodoListCommand)
export class DeleteTodoListHandler
  implements ICommandHandler<DeleteTodoListCommand>
{
  constructor(private readonly repository: TodoListRepository) {}

  async execute(command: DeleteTodoListCommand): Promise<void> {
    const { todoListId } = command;
    return this.repository.deleteTodoList(todoListId);
  }
}
