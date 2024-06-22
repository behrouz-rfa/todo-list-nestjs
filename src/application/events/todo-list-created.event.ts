// src/application/events/todo-list-created.event.ts
import { IEvent } from '@nestjs/cqrs';

export class TodoListCreatedEvent implements IEvent {
  constructor(
    public readonly todoListId: string,
    public readonly userId: string,
    public readonly title: string,
  ) {}
}
