import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { Todo } from "@proto/todo/Todo";
import { CreateTodoRequest } from "@proto/todo/CreateTodoRequest";
import { GetTodoRequest } from "@proto/todo/GetTodoRequest";
import { ListTodosRequest } from "@proto/todo/ListTodosRequest";
import { ListTodosResponse } from "@proto/todo/ListTodosResponse";
import { UpdateTodoRequest } from "@proto/todo/UpdateTodoRequest";
import { DeleteTodoRequest } from "@proto/todo/DeleteTodoRequest";
import { DeleteTodoResponse } from "@proto/todo/DeleteTodoResponse";

export type {
  Todo as ITodo,
  CreateTodoRequest as ICreateTodoRequest,
  GetTodoRequest as IGetTodoRequest,
  ListTodosRequest as IListTodosRequest,
  ListTodosResponse as IListTodosResponse,
  UpdateTodoRequest as IUpdateTodoRequest,
  DeleteTodoRequest as IDeleteTodoRequest,
  DeleteTodoResponse as IDeleteTodoResponse,
};

export interface ITodoService {
  CreateTodo: (
    call: ServerUnaryCall<CreateTodoRequest, Todo>,
    callback: sendUnaryData<Todo>
  ) => Promise<void>;

  GetTodo: (
    call: ServerUnaryCall<GetTodoRequest, Todo>,
    callback: sendUnaryData<Todo>
  ) => Promise<void>;

  ListTodos: (
    call: ServerUnaryCall<ListTodosRequest, ListTodosResponse>,
    callback: sendUnaryData<ListTodosResponse>
  ) => Promise<void>;

  UpdateTodo: (
    call: ServerUnaryCall<UpdateTodoRequest, Todo>,
    callback: sendUnaryData<Todo>
  ) => Promise<void>;

  DeleteTodo: (
    call: ServerUnaryCall<DeleteTodoRequest, DeleteTodoResponse>,
    callback: sendUnaryData<DeleteTodoResponse>
  ) => Promise<void>;
}
