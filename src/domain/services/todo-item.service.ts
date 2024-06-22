import { Injectable } from '@nestjs/common';
import { TodoItemRepository } from '../repositories/todo-item.repository';
import { TodoItem } from '../models/todo-item.model';
import { CreateTodoItemDto } from '../dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from '../dtos/update-todo-item.dto';

@Injectable()
export class TodoItemService {
  constructor(private readonly todoItemRepository: TodoItemRepository) {}

  async createTodoItem(
    todoListId: string,
    createTodoItemDto: CreateTodoItemDto,
  ): Promise<TodoItem> {
    return this.todoItemRepository.createTodoItem(
      todoListId,
      createTodoItemDto,
    );
  }

  async findTodoItemById(todoItemId: string): Promise<TodoItem> {
    // Implement find by id logic if necessary
    // Not currently supported as per provided code
    console.log('Method not implemented', todoItemId);
    return null;
  }

  async deleteTodoItem(todoListId: string, todoItemId: string): Promise<any> {
    return this.todoItemRepository.deleteTodoItem(todoListId, todoItemId);
  }

  async updateTodoItem(
    todoListId: string,
    todoItemId: string,
    updateTodoItemDto: UpdateTodoItemDto,
  ): Promise<TodoItem> {
    return this.todoItemRepository.updateTodoItem(
      todoListId,
      todoItemId,
      updateTodoItemDto,
    );
  }
}