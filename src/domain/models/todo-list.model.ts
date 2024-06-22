import { TodoItem } from './todo-item.model';

export class TodoList {
  id: string;
  userId: string;
  title: string;
  todoItems: TodoItem[];
}
