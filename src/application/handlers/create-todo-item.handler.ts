import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateTodoItemCommand } from '../commands/create-todo-item.command';
import { TodoItemService } from '../../domain/services/todo-item.service';
import { TodoItem } from '../../domain/models/todo-item.model';
import { TodoLitemaggregate } from '../aggregates/todo-litemaggregate';

@CommandHandler(CreateTodoItemCommand)
export class CreateTodoItemHandler
  implements ICommandHandler<CreateTodoItemCommand>
{
  constructor(
    private readonly todoItemService: TodoItemService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateTodoItemCommand): Promise<TodoItem> {
    const todoItem = await this.todoItemService.createTodoItem(
      command.todoListId,
      command.createTodoItemDto,
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
