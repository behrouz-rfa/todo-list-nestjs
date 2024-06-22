// src/application/events/user-created.event.ts
import { IEvent } from '@nestjs/cqrs';

export class UserCreatedEvent implements IEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
  ) {}
}
