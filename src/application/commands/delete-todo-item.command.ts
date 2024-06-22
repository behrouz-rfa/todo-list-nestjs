export class DeleteTodoItemCommand {
  constructor(
    public readonly todoListId: string,
    public readonly todoItemId: string,
  ) {}
}
