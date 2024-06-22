import { AggregateRoot } from '@nestjs/cqrs';
import { TodoItemCreatedEvent } from '../events/todo-item-created.event';

export class TodoLitemaggregate extends AggregateRoot {
  private readonly _id: string;

  constructor(id: string) {
    super();
    this._id = id;
  }

  createTodoItem(
    todoItemId: string,
    todoListId: string,
    title: string,
    description: string,
    priority: number,
  ) {
    // Logic for creating a todo item
    const event = new TodoItemCreatedEvent(
      todoItemId,
      todoListId,
      title,
      description,
      priority,
    );
    this.apply(event);
  }
}
