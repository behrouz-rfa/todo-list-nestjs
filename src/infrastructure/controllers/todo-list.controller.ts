import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTodoListDto } from '../../domain/dtos/create-todo-list.dto';
import { TodoList } from '../../domain/models/todo-list.model';
import { CreateTodoListCommand } from '../../application/commands/create-todo-list.command';
import { DeleteTodoListCommand } from '../../application/commands/delete-todo-list.command';
import { TodoListService } from '../../domain/services/todo-list.service';
import { GetTodoListByIdQuery } from '../../application/queries/get-todo-list-by-id.query';

@Controller('todo-lists')
export class TodoListController {
  constructor(
    private readonly todoListService: TodoListService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createTodoList(
    @Body() createTodoListDto: CreateTodoListDto,
  ): Promise<TodoList> {
    const command = new CreateTodoListCommand(createTodoListDto);
    return this.commandBus.execute(command);
  }

  @Get(':id')
  async getTodoListById(@Param('id') todoListId: string): Promise<TodoList> {
    const command = new GetTodoListByIdQuery(todoListId);
    return this.queryBus.execute(command);
  }

  @Delete(':id')
  async deleteTodoList(@Param('id') todoListId: string): Promise<void> {
    const command = new DeleteTodoListCommand(todoListId);
    await this.commandBus.execute(command);
  }
}
