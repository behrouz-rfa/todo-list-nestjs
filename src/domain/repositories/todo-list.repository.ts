import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { TodoList } from '../models/todo-list.model';
import { TodoListDocument } from '../../infrastructure/schemas/todo-list.schema';
import { CreateTodoListDto } from '../dtos/create-todo-list.dto';
import { CreateTodoItemDto } from '../dtos/create-todo-item.dto';

@Injectable()
export class TodoListRepository {
  constructor(
    @InjectModel('TodoList') private todoListModel: Model<TodoListDocument>,
  ) {}

  async createTodoList(
    createTodoListDto: CreateTodoListDto,
  ): Promise<TodoList> {
    const createdTodoList = new this.todoListModel(createTodoListDto);
    const savedTodoList = await createdTodoList.save();
    return this.mapTodoListDocumentToModel(savedTodoList);
  }

  async findTodoListById(todoListId: string): Promise<TodoList> {
    const aggregationPipeline: PipelineStage[] = [
      { $match: {} }, // Replace with your actual match conditions
      { $unwind: '$todoItems' },
      {
        $sort: {
          'todoItems.priority': -1,
        },
      },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          title: { $first: '$title' },
          todoItems: { $push: '$todoItems' },
          __v: { $first: '$__v' },
        },
      },
    ];
    const todoListDocument =
      await this.todoListModel.aggregate(aggregationPipeline);

    if (!todoListDocument || todoListDocument.length === 0) {
      throw new NotFoundException(
        `Todo list with ID "${todoListId}" not found`,
      );
    }

    return this.mapTodoListDocumentToModel(todoListDocument[0]);
  }

  async addTodoItem(
    todoListId: string,
    createTodoItemDto: CreateTodoItemDto,
  ): Promise<TodoList> {
    const todoList = await this.todoListModel.findById(todoListId).exec();
    todoList.todoItems.push(createTodoItemDto);
    await todoList.save();
    return this.mapTodoListDocumentToModel(todoList);
  }

  async deleteTodoList(todoListId: string): Promise<any> {
    return this.todoListModel.findByIdAndDelete(todoListId).exec();
  }

  private mapTodoListDocumentToModel(document: TodoListDocument): TodoList {
    return {
      id: document._id.toString(),
      userId: document.userId,
      title: document.title,
      todoItems: document.todoItems.map((item) => ({
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        priority: item.priority,
      })),
    };
  }
}
