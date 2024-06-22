import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTodoItemDto } from '../../domain/dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from '../../domain/dtos/update-todo-item.dto';
import { TodoItem } from '../../domain/models/todo-item.model';
import { CreateTodoItemCommand } from '../../application/commands/create-todo-item.command';
import { UpdateTodoItemCommand } from '../../application/commands/update-todo-item.command';
import { DeleteTodoItemCommand } from '../../application/commands/delete-todo-item.command';
import { GetTodoListQuery } from '../../application/queries/get-todo-list.query';

@Controller('todo-items')
export class TodoItemController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':todoListID')
  async createTodoItem(
    @Param('todoListID') todoListID: string,
    @Body() createTodoItemDto: CreateTodoItemDto,
  ): Promise<TodoItem> {
    const command = new CreateTodoItemCommand(todoListID, createTodoItemDto);
    return this.commandBus.execute(command);
  }

  @Get(':id')
  async getTodoItemById(@Param('id') todoItemId: string): Promise<TodoItem> {
    return this.commandBus.execute(new GetTodoListQuery(todoItemId)); // Assume you have a query for this
  }

  @Delete(':todoListID/:todoItemId')
  async deleteTodoItem(
    @Param('todoListID') todoListID: string,
    @Param('todoItemId') todoItemId: string,
  ): Promise<any> {
    const command = new DeleteTodoItemCommand(todoListID, todoItemId);
    return this.commandBus.execute(command);
  }

  @Put(':todoListId/:todoItemId')
  async updateTodoItem(
    @Param('todoListId') todoListId: string,
    @Param('todoItemId') todoItemId: string,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
  ): Promise<TodoItem> {
    const command = new UpdateTodoItemCommand(
      todoListId,
      todoItemId,
      updateTodoItemDto,
    );
    return this.commandBus.execute(command);
  }
}
