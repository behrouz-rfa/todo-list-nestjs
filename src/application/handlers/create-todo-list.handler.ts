import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateTodoListCommand } from '../commands/create-todo-list.command';
import { TodoListService } from '../../domain/services/todo-list.service';
import { TodoList } from '../../domain/models/todo-list.model';
import { TodoListAggregate } from '../aggregates/todo-list.aggregate';

@CommandHandler(CreateTodoListCommand)
export class CreateTodoListHandler
  implements ICommandHandler<CreateTodoListCommand>
{
  constructor(
    private readonly todoListService: TodoListService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateTodoListCommand): Promise<TodoList> {
    const todoList = await this.todoListService.createTodoList(
      command.createTodoListDto,
    );

    const todoListAggregate = this.eventPublisher.mergeObjectContext(
      new TodoListAggregate(todoList.id),
    );

    todoListAggregate.createTodoList(
      todoList.id,
      todoList.userId,
      todoList.title,
    );

    todoListAggregate.commit();

    return todoList;
  }
}
