// src/application/events/todo-item-created.event.ts
import { IEvent } from '@nestjs/cqrs';

export class TodoItemCreatedEvent implements IEvent {
  constructor(
    public readonly todoItemId: string,
    public readonly todoListId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly priority: number,
  ) {}
}
