import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto, LoginUserDto } from '../domain/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../domain/services/user.service';
import { User } from '../domain/models/user.model';

// Mock data
const mockLoginDto: LoginUserDto = {
  username: 'testuser',
  password: 'testpassword',
};

const mockCreateUserDto: CreateUserDto = {
  username: 'newuser',
  password: 'newpassword',
};

const mockUser: User = {
  id: '1',
  username: 'newuser',
  password: 'hashedpassword',
  todoLists: [],
};
// Mock repositories

const mockAuthService = {
  login: jest.fn().mockResolvedValue({ access_token: 'test-token' }),
  register: jest.fn().mockResolvedValue(mockUser),
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(mockLoginDto)
      .expect(201) // Expecting a 200 OK status for login
      .expect((res) => {
        expect(res.body).toEqual({ access_token: 'test-token' });
        expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
      });
  });

  it('/auth/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(mockCreateUserDto)
      .expect(201) // Expecting a 201 Created status for register
      .expect((res) => {
        expect(res.body).toEqual(mockUser);
        expect(mockAuthService.register).toHaveBeenCalledWith(
          mockCreateUserDto,
        );
      });
  });
});
