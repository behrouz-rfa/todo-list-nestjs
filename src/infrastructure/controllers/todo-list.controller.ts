import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTodoListDto } from '../../domain/dtos/create-todo-list.dto';
import { TodoList } from '../../domain/models/todo-list.model';
import { CreateTodoListCommand } from '../../application/commands/create-todo-list.command';
import { DeleteTodoListCommand } from '../../application/commands/delete-todo-list.command';
import { TodoListService } from '../../domain/services/todo-list.service';
import { GetTodoListByIdQuery } from '../../application/queries/get-todo-list-by-id.query';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('todo-lists')
@ApiTags('TodoList')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TodoListController {
  constructor(
    private readonly todoListService: TodoListService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Todo List' })
  @ApiResponse({
    status: 201,
    description: 'The Todo List has been successfully created.',
    type: TodoList,
  })
  async createTodoList(
    @Body() createTodoListDto: CreateTodoListDto,
  ): Promise<TodoList> {
    const command = new CreateTodoListCommand(createTodoListDto);
    return this.commandBus.execute(command);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Todo List by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the Todo List.',
    type: TodoList,
  })
  @ApiResponse({ status: 404, description: 'Todo List not found.' })
  async getTodoListById(@Param('id') todoListId: string): Promise<TodoList> {
    const command = new GetTodoListByIdQuery(todoListId);
    return this.queryBus.execute(command);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Todo List' })
  @ApiResponse({
    status: 200,
    description: 'The Todo List has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Todo List not found.' })
  async deleteTodoList(@Param('id') todoListId: string): Promise<void> {
    const command = new DeleteTodoListCommand(todoListId);
    await this.commandBus.execute(command);
  }
}
