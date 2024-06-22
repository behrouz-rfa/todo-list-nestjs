import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TodoListController } from '../infrastructure/controllers/todo-list.controller';
import { TodoListService } from '../domain/services/todo-list.service';
import { CreateTodoListCommand } from '../application/commands/create-todo-list.command';
import { DeleteTodoListCommand } from '../application/commands/delete-todo-list.command';
import { GetTodoListByIdQuery } from '../application/queries/get-todo-list-by-id.query';
import { CreateTodoListDto } from '../domain/dtos/create-todo-list.dto';

describe('TodoListController', () => {
  let controller: TodoListController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoListController],
      providers: [
        {
          provide: TodoListService,
          useValue: {},
        },
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoListController>(TodoListController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should create a todo list', async () => {
    const createTodoListDto: CreateTodoListDto = {
      title: 'Test List',
      userId: 'user123',
    };
    const expectedResult = { id: '1', ...createTodoListDto };

    jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.createTodoList(createTodoListDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.any(CreateTodoListCommand),
    );
    expect(result).toEqual(expectedResult);
  });

  it('should get a todo list by id', async () => {
    const todoListId = '1';
    const expectedResult = {
      id: todoListId,
      title: 'Test List',
      userId: 'user123',
    };

    jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.getTodoListById(todoListId);

    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.any(GetTodoListByIdQuery),
    );
    expect(result).toEqual(expectedResult);
  });

  it('should delete a todo list', async () => {
    const todoListId = '1';

    jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);

    await controller.deleteTodoList(todoListId);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.any(DeleteTodoListCommand),
    );
  });
});
