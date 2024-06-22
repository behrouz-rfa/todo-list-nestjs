import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserController } from './infrastructure/controllers/user.controller';
import { TodoListController } from './infrastructure/controllers/todo-list.controller';
import { TodoItemController } from './infrastructure/controllers/todo-item.controller';
import { UserService } from './domain/services/user.service';
import { TodoListService } from './domain/services/todo-list.service';
import { TodoItemService } from './domain/services/todo-item.service';
import { UserRepository } from './domain/repositories/user.repository';
import { TodoListRepository } from './domain/repositories/todo-list.repository';
import { TodoItemRepository } from './domain/repositories/todo-item.repository';
import { CreateUserCommand } from './application/commands/create-user.command';
import { CreateTodoListCommand } from './application/commands/create-todo-list.command';
import { CreateTodoItemCommand } from './application/commands/create-todo-item.command';
import { UserCreatedEvent } from './application/events/user-created.event';
import { TodoListCreatedEvent } from './application/events/todo-list-created.event';
import { TodoItemCreatedEvent } from './application/events/todo-item-created.event';
import { GetUserQuery } from './application/queries/get-user.query';
import { GetTodoListQuery } from './application/queries/get-todo-list.query';
import { GetTodoItemQuery } from './application/queries/get-todo-item.query';
import { TodoSaga } from './application/sagas/todo.saga';
import { CreateUserHandler } from './application/handlers/create-user.handler';
import { GetUserHandler } from './application/handlers/get-user.handler';
import { UserCreatedHandler } from './application/handlers/user-created.handler';
import { CreateTodoListHandler } from './application/handlers/create-todo-list.handler';
import { GetTodoListByIdHandler } from './application/handlers/get-todo-list.handler';
import { CreateTodoItemHandler } from './application/handlers/create-todo-item.handler';
import { GetTodoItemHandler } from './application/handlers/get-todo-item.handler';
import { DeleteTodoItemHandler } from './application/handlers/delete-todo-item.handler';
import { DeleteTodoListHandler } from './application/handlers/delete-todo-list.handler';

@Module({
  imports: [DatabaseModule, CqrsModule],
  controllers: [UserController, TodoListController, TodoItemController],
  providers: [
    UserService,
    UserRepository,
    TodoListService,
    TodoListRepository,
    TodoItemService,
    TodoItemRepository,
    CreateUserCommand,
    CreateTodoListCommand,
    CreateTodoItemCommand,
    UserCreatedEvent,
    TodoListCreatedEvent,
    TodoItemCreatedEvent,
    GetUserQuery,
    GetTodoListQuery,
    GetTodoItemQuery,
    TodoSaga,
    CreateUserHandler,
    GetUserHandler,
    UserCreatedHandler,
    CreateTodoListHandler,
    GetTodoListByIdHandler,
    CreateTodoItemHandler,
    GetTodoItemHandler,
    DeleteTodoItemHandler,
    DeleteTodoListHandler,
  ],
})
export class AppModule {}
