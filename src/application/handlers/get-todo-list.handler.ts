import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTodoListByIdQuery } from '../queries/get-todo-list-by-id.query';
import { TodoListService } from '../../domain/services/todo-list.service';
import { TodoList } from '../../domain/models/todo-list.model';
import { NotFoundException } from '../../infrastructure/exceptions/all.exception';

@QueryHandler(GetTodoListByIdQuery)
export class GetTodoListByIdHandler
  implements IQueryHandler<GetTodoListByIdQuery>
{
  constructor(private readonly todoListService: TodoListService) {}

  async execute(query: GetTodoListByIdQuery): Promise<TodoList> {
    const { todoListId } = query;
    const todoList = await this.todoListService.findTodoListById(todoListId);
    if (!todoList) {
      throw new NotFoundException(
        `Todo list with ID "${todoListId}" not found`,
      );
    }
    return todoList;
  }
}
