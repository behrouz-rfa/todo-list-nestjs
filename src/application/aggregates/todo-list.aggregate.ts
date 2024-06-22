import { AggregateRoot } from '@nestjs/cqrs';
import { TodoListCreatedEvent } from '../../application/events/todo-list-created.event';

export class TodoListAggregate extends AggregateRoot {
  private readonly _id: string;

  constructor(id: string) {
    super();
    this._id = id;
  }

  createTodoList(todoListId: string, userId: string, title: string) {
    const event = new TodoListCreatedEvent(todoListId, userId, title);
    this.apply(event);
  }
}
