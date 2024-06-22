import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { TodoItemController } from '../infrastructure/controllers/todo-item.controller';
import { CreateTodoItemCommand } from '../application/commands/create-todo-item.command';
import { UpdateTodoItemCommand } from '../application/commands/update-todo-item.command';
import { DeleteTodoItemCommand } from '../application/commands/delete-todo-item.command';
import { GetTodoListQuery } from '../application/queries/get-todo-list.query';

describe('TodoItemController', () => {
  let controller: TodoItemController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoItemController>(TodoItemController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should create a todo item', async () => {
    const createTodoItemDto = {
      title: 'Test Todo',
      description: 'Test Description',
    };
    const todoListId = '123';
    const expectedResult = { id: '1', ...createTodoItemDto };

    jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.createTodoItem(
      todoListId,
      createTodoItemDto,
    );

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.any(CreateTodoItemCommand),
    );
    expect(result).toEqual(expectedResult);
  });

  it('should get a todo item by id', async () => {
    const todoItemId = '1';
    const expectedResult = {
      id: todoItemId,
      title: 'Test Todo',
      description: 'Test Description',
    };

    jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.getTodoItemById(todoItemId);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.any(GetTodoListQuery),
    );
    expect(result).toEqual(expectedResult);
  });

  it('should delete a todo item', async () => {
    const todoListId = '123';
    const todoItemId = '1';

    jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);

    await controller.deleteTodoItem(todoListId, todoItemId);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.any(DeleteTodoItemCommand),
    );
  });

  it('should update a todo item', async () => {
    const todoListId = '123';
    const todoItemId = '1';
    const updateTodoItemDto = {
      title: 'Updated Todo',
      description: 'Updated Description',
    };
    const expectedResult = { id: todoItemId, ...updateTodoItemDto };

    jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.updateTodoItem(
      todoListId,
      todoItemId,
      updateTodoItemDto,
    );

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.any(UpdateTodoItemCommand),
    );
    expect(result).toEqual(expectedResult);
  });
});
