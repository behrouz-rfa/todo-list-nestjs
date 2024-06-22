import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTodoItemQuery } from '../queries/get-todo-item.query';
import { TodoItemService } from '../../domain/services/todo-item.service';
import { TodoItem } from '../../domain/models/todo-item.model';

@QueryHandler(GetTodoItemQuery)
export class GetTodoItemHandler implements IQueryHandler<GetTodoItemQuery> {
  constructor(private readonly todoItemService: TodoItemService) {}

  async execute(query: GetTodoItemQuery): Promise<TodoItem> {
    const { todoItemId } = query;
    return this.todoItemService.findTodoItemById(todoItemId);
  }
}
