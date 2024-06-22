import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTodoItemDto } from '../../domain/dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from '../../domain/dtos/update-todo-item.dto';
import { TodoItem } from '../../domain/models/todo-item.model';
import { CreateTodoItemCommand } from '../../application/commands/create-todo-item.command';
import { UpdateTodoItemCommand } from '../../application/commands/update-todo-item.command';
import { DeleteTodoItemCommand } from '../../application/commands/delete-todo-item.command';
import { GetTodoListQuery } from '../../application/queries/get-todo-list.query';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('todo-items')
@UseGuards(JwtAuthGuard)
@ApiTags('TodoItem')
@ApiBearerAuth()
export class TodoItemController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':todoListID')
  @ApiOperation({ summary: 'Create a new Todo Item' })
  @ApiResponse({
    status: 201,
    description: 'The Todo Item has been successfully created.',
    type: TodoItem,
  })
  async createTodoItem(
    @Param('todoListID') todoListID: string,
    @Body() createTodoItemDto: CreateTodoItemDto,
  ): Promise<TodoItem> {
    const command = new CreateTodoItemCommand(todoListID, createTodoItemDto);
    return this.commandBus.execute(command);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Todo Item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the Todo Item.',
    type: TodoItem,
  })
  @ApiResponse({ status: 404, description: 'Todo Item not found.' })
  async getTodoItemById(@Param('id') todoItemId: string): Promise<TodoItem> {
    return this.commandBus.execute(new GetTodoListQuery(todoItemId));
  }

  @Delete(':todoListID/:todoItemId')
  @ApiOperation({ summary: 'Delete a Todo Item' })
  @ApiResponse({
    status: 200,
    description: 'The Todo Item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Todo Item not found.' })
  async deleteTodoItem(
    @Param('todoListID') todoListID: string,
    @Param('todoItemId') todoItemId: string,
  ): Promise<any> {
    const command = new DeleteTodoItemCommand(todoListID, todoItemId);
    return this.commandBus.execute(command);
  }

  @Put(':todoListId/:todoItemId')
  @ApiOperation({ summary: 'Update a Todo Item' })
  @ApiResponse({
    status: 200,
    description: 'The Todo Item has been successfully updated.',
    type: TodoItem,
  })
  @ApiResponse({ status: 404, description: 'Todo Item not found.' })
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
