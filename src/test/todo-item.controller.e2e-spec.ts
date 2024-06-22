import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoItemController } from '../infrastructure/controllers/todo-item.controller';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TodoItem } from '../domain/models/todo-item.model';
import { UpdateTodoItemCommand } from '../application/commands/update-todo-item.command';
import { TodoItemRepository } from '../domain/repositories/todo-item.repository';

const mockTodoItem: TodoItem = {
  id: '456',
  title: 'Test Todo',
  description: 'Testing create Todo Item',
  priority: 1,
};

// Mock JwtAuthGuard
class MockJwtAuthGuard {
  canActivate() {
    return true; // Always allow for testing purposes
  }
}

// Mock TodoItemRepository
const mockTodoItemRepository = {
  createTodoItem: jest.fn().mockResolvedValue(mockTodoItem),
  deleteTodoItem: jest.fn().mockResolvedValue({ deleted: true }),
  updateTodoItem: jest.fn().mockResolvedValue({
    ...mockTodoItem,
    title: 'Updated Todo',
    description: 'Updated description',
  }),
};

// Mock CommandBus
const mockCommandBus = {
  execute: jest.fn().mockImplementation((command) => {
    if (command instanceof UpdateTodoItemCommand) {
      return Promise.resolve({
        ...mockTodoItem,
        ...command.updateTodoItemDto,
      });
    }
    return Promise.resolve(mockTodoItem);
  }),
};
describe('TodoItemController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemController],
      providers: [
        CommandBus,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn().mockImplementation((command) => {
              if (command instanceof UpdateTodoItemCommand) {
                return Promise.resolve({
                  ...mockTodoItem,
                  ...command.updateTodoItemDto,
                });
              }
              return Promise.resolve(mockTodoItem);
            }),
          },
        },
        {
          provide: TodoItemRepository,
          useValue: mockTodoItemRepository,
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

  it('/todo-items/:todoListID (POST)', async () => {
    const todoListID = '456';
    const createTodoItemDto = {
      title: 'Test Todo',
      description: 'Testing create Todo Item',
    };

    await request(app.getHttpServer())
      .post(`/todo-items/${todoListID}`)
      .send(createTodoItemDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe(createTodoItemDto.title);
        expect(res.body.description).toBe(createTodoItemDto.description);
      });
  });

  it('/todo-items/:id (GET)', async () => {
    const todoItemId = '456';

    await request(app.getHttpServer())
      .get(`/todo-items/${todoItemId}`)
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.id).toBe(mockTodoItem.id);
        expect(res.body.title).toBe(mockTodoItem.title);
        expect(res.body.description).toBe(mockTodoItem.description);
      });
  });

  it('/todo-items/:todoListID/:todoItemId (DELETE)', async () => {
    const todoListID = '123';
    const todoItemId = '456';

    jest.spyOn(mockCommandBus, 'execute').mockResolvedValue(null);

    await request(app.getHttpServer())
      .delete(`/todo-items/${todoListID}/${todoItemId}`)
      .set('Authorization', 'Bearer test-token')
      .expect(200);
  });

  it('/todo-items/:todoListId/:todoItemId (PUT)', async () => {
    const todoListId = '123';
    const todoItemId = '456';
    const updateTodoItemDto = {
      title: 'Updated Todo',
    };

    await request(app.getHttpServer())
      .put(`/todo-items/${todoListId}/${todoItemId}`)
      .send(updateTodoItemDto)
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.title).toBe(updateTodoItemDto.title);
      });
  });
});
