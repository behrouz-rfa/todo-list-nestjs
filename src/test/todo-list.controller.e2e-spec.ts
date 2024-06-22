import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TodoListController } from '../infrastructure/controllers/todo-list.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTodoListDto } from '../domain/dtos/create-todo-list.dto';
import { TodoList } from '../domain/models/todo-list.model';
import { TodoListService } from '../domain/services/todo-list.service';
import { TodoListRepository } from '../domain/repositories/todo-list.repository';
import { UserRepository } from '../domain/repositories/user.repository';
import { INestApplication } from '@nestjs/common';

// Mock data
const mockTodoList: TodoList = {
  id: '1',
  userId: 'user123',
  title: 'Test Todo List',
  todoItems: [],
};

// Mock JwtAuthGuard
class MockJwtAuthGuard {
  canActivate() {
    return true; // Always allow for testing purposes
  }
}

// Mock CommandBus and QueryBus
const mockCommandBus = {
  execute: jest.fn().mockResolvedValue(mockTodoList),
};
const mockQueryBus = {
  execute: jest.fn().mockResolvedValue(mockTodoList),
};

// Mock repositories
const mockTodoListRepository = {
  createTodoList: jest.fn(),
  findTodoListById: jest.fn(),
  deleteTodoList: jest.fn(),
};

const mockUserRepository = {
  findUserById: jest.fn(),
};

describe('TodoListController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TodoListController],
      providers: [
        CommandBus,
        QueryBus,
        TodoListService, // Ensure the TodoListService is provided
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
        {
          provide: TodoListRepository,
          useValue: mockTodoListRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(new MockJwtAuthGuard())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/todo-lists (POST)', async () => {
    const createTodoListDto: CreateTodoListDto = {
      userId: 'user123',
      title: 'Test Todo List',
    };

    await request(app.getHttpServer())
      .post('/todo-lists')
      .send(createTodoListDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.userId).toBe(createTodoListDto.userId);
        expect(res.body.title).toBe(createTodoListDto.title);
      });
  });

  it('/todo-lists/:id (GET)', async () => {
    const todoListId = '1';

    await request(app.getHttpServer())
      .get(`/todo-lists/${todoListId}`)
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(todoListId);
        expect(res.body.userId).toBe(mockTodoList.userId);
        expect(res.body.title).toBe(mockTodoList.title);
      });
  });

  it('/todo-lists/:id (DELETE)', async () => {
    const todoListId = '1';

    jest.spyOn(mockCommandBus, 'execute').mockResolvedValue(null);

    await request(app.getHttpServer())
      .delete(`/todo-lists/${todoListId}`)
      .set('Authorization', 'Bearer test-token')
      .expect(200);
  });
});
