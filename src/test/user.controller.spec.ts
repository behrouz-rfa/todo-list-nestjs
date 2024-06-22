import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserController } from '../infrastructure/controllers/user.controller';
import { CreateUserCommand } from '../application/commands/create-user.command';
import { GetUserQuery } from '../application/queries/get-user.query';

describe('UserController', () => {
  let controller: UserController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
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

    controller = module.get<UserController>(UserController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should register a user', async () => {
    const createUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };
    const expectedResult = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
    };

    jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.registerUser(createUserDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.any(CreateUserCommand),
    );
    expect(result).toEqual(expectedResult);
  });

  it('should get a user by id', async () => {
    const userId = '1';
    const expectedResult = {
      id: userId,
      username: 'testuser',
      email: 'test@example.com',
    };

    jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

    const result = await controller.getUserById(userId);

    expect(queryBus.execute).toHaveBeenCalledWith(expect.any(GetUserQuery));
    expect(result).toEqual(expectedResult);
  });
});
