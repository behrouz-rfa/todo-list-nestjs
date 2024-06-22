import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoListRepository } from '../repositories/todo-list.repository';
import { TodoList } from '../models/todo-list.model';
import { CreateTodoListDto } from '../dtos/create-todo-list.dto';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';

@Injectable()
export class TodoListService {
  constructor(
    private readonly todoListRepository: TodoListRepository,
    private readonly userRepository: UserRepository, // Inject UserRepository
  ) {}

  async createTodoList(
    createTodoListDto: CreateTodoListDto,
  ): Promise<TodoList> {
    const user: User = await this.userRepository.findUserById(
      createTodoListDto.userId,
    );
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createTodoListDto.userId} not found`,
      );
    }
    return this.todoListRepository.createTodoList(createTodoListDto);
  }

  async findTodoListById(todoListId: string): Promise<TodoList> {
    return this.todoListRepository.findTodoListById(todoListId);
  }

  async deleteTodoList(todoListId: string): Promise<any> {
    return this.todoListRepository.deleteTodoList(todoListId);
  }

  async getTodoListById(todoListId: string): Promise<TodoList> {
    return this.todoListRepository.findTodoListById(todoListId);
  }
}
