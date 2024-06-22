import { Injectable } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoListCreatedEvent } from '../events/todo-list-created.event';
import { TodoItemCreatedEvent } from '../events/todo-item-created.event';

@Injectable()
export class TodoSaga {
  @Saga()
  todoListCreated = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(TodoListCreatedEvent),
      map((event) => {
        // Handling side-effects or additional logic when a todo list is created
        console.log(`Todo List Created:) ${event.todoListId}`);
      }),
    );
  };

  @Saga()
  todoItemCreated = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(TodoItemCreatedEvent),
      map((event) => {
        // Handling side-effects or additional logic when a todo item is created
        console.log(`Todo Item Created:) ${event.todoItemId}`);
      }),
    );
  };
}
