import { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js";

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
  description: string;
}

export interface GetTodoRequest {
  id: number;
}

export interface ListTodosRequest {
  page: number;
  limit: number;
}

export interface ListTodosResponse {
  todos: Todo[];
  total: number;
}

export interface UpdateTodoRequest {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface DeleteTodoRequest {
  id: number;
}

export interface DeleteTodoResponse {
  success: boolean;
}

export interface TodoServiceClient extends ServiceClientConstructor {
  createTodo: any;
  getTodo: any;
  listTodos: any;
  updateTodo: any;
  deleteTodo: any;
}

export interface TodoServiceDefinition {
  TodoService: TodoServiceClient;
}

export interface ProtoGrpcType {
  todo: TodoServiceDefinition;
}
