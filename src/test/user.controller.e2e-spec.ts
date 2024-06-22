import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserController } from '../infrastructure/controllers/user.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUserQuery } from '../application/queries/get-user.query';
import { User } from '../domain/models/user.model';

// Mock data
const mockUser: User = {
  id: '1',
  username: 'John Doe',
  password: '123445',
  todoLists: [],
};

// Mock JwtAuthGuard
class MockJwtAuthGuard {
  canActivate() {
    return true; // Always allow for testing purposes
  }
}

// Mock QueryBus
const mockQueryBus = {
  execute: jest.fn().mockResolvedValue(mockUser),
};

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        CommandBus,
        {
          provide: QueryBus,
          useValue: mockQueryBus,
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
    await app.close();
  });

  it('/users/:id (GET)', async () => {
    const userId = '1';
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(mockUser);
        expect(mockQueryBus.execute).toHaveBeenCalledWith(
          new GetUserQuery(userId),
        );
      });
  });
});
