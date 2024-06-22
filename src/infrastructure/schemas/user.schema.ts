import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  todoLists: [{ type: Schema.Types.ObjectId, ref: 'TodoList' }],
});

export interface UserDocument extends Document {
  username: string;
  password: string;
  todoLists: string[];
}
