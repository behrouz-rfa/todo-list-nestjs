import { Schema, Document, Types } from 'mongoose';

// Define the TodoItem subdocument schema
const TodoItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: Number, required: true },
});

export interface TodoItemDocument extends Document {
  title: string;
  description: string;
  priority: number;
}

export const TodoListSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  todoItems: [TodoItemSchema], // Embed the TodoItem schema
});

export interface TodoListDocument extends Document {
  userId: string;
  title: string;
  todoItems: Types.DocumentArray<TodoItemDocument>;
}
