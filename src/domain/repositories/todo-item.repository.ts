import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { TodoItem } from '../models/todo-item.model';
import { TodoListDocument } from '../../infrastructure/schemas/todo-list.schema';
import { CreateTodoItemDto } from '../dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from '../dtos/update-todo-item.dto';

@Injectable()
export class TodoItemRepository {
  constructor(
    @InjectModel('TodoList') private todoListModel: Model<TodoListDocument>,
  ) {}

  async createTodoItem(
    todoListId: string,
    createTodoItemDto: CreateTodoItemDto,
  ): Promise<TodoItem> {
    const todoList = await this.todoListModel.findById(todoListId).exec();
    if (!todoList) {
      throw new NotFoundException('TodoList not found');
    }
    todoList.todoItems.push(createTodoItemDto);
    await todoList.save();
    const addedItem = todoList.todoItems[todoList.todoItems.length - 1];
    return this.mapTodoItemDocumentToModel(addedItem);
  }

  async getItemById(todoListId: string, todoItemId: string): Promise<TodoItem> {
    const aggregationPipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(todoListId) } },
      { $unwind: '$todoItems' },
      { $match: { 'todoItems._id': new mongoose.Types.ObjectId(todoItemId) } },
      {
        $project: {
          _id: '$todoItems._id',
          title: '$todoItems.title',
          description: '$todoItems.description',
          priority: '$todoItems.priority',
        },
      },
    ];

    const result = await this.todoListModel
      .aggregate(aggregationPipeline)
      .exec();

    if (result.length === 0) {
      throw new NotFoundException('TodoItem not found');
    }

    return this.mapTodoItemDocumentToModel(result[0]);
  }

  async deleteTodoItem(todoListId: string, todoItemId: string): Promise<any> {
    const aggregationPipeline: PipelineStage[] = [
      { $match: { _id: new mongoose.Types.ObjectId(todoListId) } },
      { $unwind: '$todoItems' },
      { $match: { 'todoItems._id': new mongoose.Types.ObjectId(todoItemId) } },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          title: { $first: '$title' },
          todoItems: { $push: '$todoItems' },
        },
      },
      {
        $set: {
          todoItems: {
            $filter: {
              input: '$todoItems',
              as: 'item',
              cond: {
                $ne: ['$$item._id', new mongoose.Types.ObjectId(todoItemId)],
              },
            },
          },
        },
      },
    ];

    const todoListDocument = await this.todoListModel
      .aggregate(aggregationPipeline)
      .exec();

    if (todoListDocument.length === 0) {
      throw new NotFoundException('TodoList or TodoItem not found');
    }

    // Update the TodoList by pulling the TodoItem and return the updated list
    const result = await this.todoListModel
      .findOneAndUpdate(
        { _id: todoListId },
        { $pull: { todoItems: { _id: todoItemId } } },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException('TodoItem not found');
    }

    return { deleted: true };
  }

  async updateTodoItem(
    todoListId: string,
    todoItemId: string,
    updateTodoItemDto: UpdateTodoItemDto,
  ): Promise<any> {
    const updateFields: any = {};
    if (updateTodoItemDto.title !== undefined) {
      updateFields['todoItems.$.title'] = updateTodoItemDto.title;
    }
    if (updateTodoItemDto.description !== undefined) {
      updateFields['todoItems.$.description'] = updateTodoItemDto.description;
    }
    if (updateTodoItemDto.priority !== undefined) {
      updateFields['todoItems.$.priority'] = updateTodoItemDto.priority;
    }

    const result = await this.todoListModel
      .findOneAndUpdate(
        { _id: todoListId, 'todoItems._id': todoItemId },
        { $set: updateFields },
        { projection: { 'todoItems.$': 1 } },
      )
      .exec();

    if (!result) {
      throw new NotFoundException('TodoItem not found');
    }
    return { deleted: true };
  }

  private mapTodoItemDocumentToModel(document: any): TodoItem {
    return {
      id: document._id.toString(),
      title: document.title,
      description: document.description,
      priority: document.priority,
    };
  }
}
