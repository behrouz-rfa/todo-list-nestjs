import { IQuery } from '@nestjs/cqrs';

export class GetTodoItemQuery implements IQuery {
  constructor(
    public readonly todoListId: string,
    public readonly todoItemId: string,
  ) {}
}
