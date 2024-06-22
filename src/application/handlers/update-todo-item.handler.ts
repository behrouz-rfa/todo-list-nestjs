import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TodoItemService } from '../../domain/services/todo-item.service';
import { TodoItem } from '../../domain/models/todo-item.model';
import { TodoLitemaggregate } from '../aggregates/todo-litemaggregate';
import { UpdateTodoItemCommand } from '../commands/update-todo-item.command';

@CommandHandler(UpdateTodoItemCommand)
export class UpdateTodoItemHandler
  implements ICommandHandler<UpdateTodoItemCommand>
{
  constructor(
    private readonly todoItemService: TodoItemService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateTodoItemCommand): Promise<TodoItem> {
    const todoItem = await this.todoItemService.updateTodoItem(
      command.todoListId,
      command.todoItemId,
      command.updateTodoItemDto,
    );

    // Create an AggregateRoot and apply the event
    const todoListAggregate = this.eventPublisher.mergeObjectContext(
      new TodoLitemaggregate(command.todoListId),
    );

    todoListAggregate.createTodoItem(
      todoItem.id,
      command.todoListId,
      todoItem.title,
      todoItem.description,
      todoItem.priority,
    );

    todoListAggregate.commit();

    return todoItem;
  }
}
