import {
  ServerUnaryCall,
  sendUnaryData,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";

import {
  ITodoService,
  ICreateTodoRequest,
  IGetTodoRequest,
  IListTodosRequest,
  IUpdateTodoRequest,
  IDeleteTodoRequest,
  ITodo,
  IListTodosResponse,
  IDeleteTodoResponse,
} from "../interfaces/todo.interface";
import { TodoService } from "../services/todo.service";

export class TodoController implements ITodoService {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  [key: string]: any; // Add index signature for UntypedServiceImplementation

  async CreateTodo(
    call: ServerUnaryCall<ICreateTodoRequest, ITodo>,
    callback: sendUnaryData<ITodo>
  ): Promise<void> {
    try {
      console.log("Received createTodo request:", call.request);
      const { title, description } = call.request;

      if (!title || !description) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "Title and description are required",
        });
      }

      const todo = await this.todoService.CreateTodo(title, description);
      console.log("Todo created successfully:", todo);
      callback(null, todo);
    } catch (error) {
      console.error("Error creating todo:", error);
      callback({
        code: 13, // INTERNAL
        message: error instanceof Error ? error.message : "Error creating todo",
      });
    }
  }

  async GetTodo(
    call: ServerUnaryCall<IGetTodoRequest, ITodo>,
    callback: sendUnaryData<ITodo>
  ): Promise<void> {
    try {
      console.log("Received getTodo request:", call.request);
      const { id } = call.request;

      if (!id) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "ID is required",
        });
      }

      const todo = await this.todoService.GetTodo(id);

      if (!todo) {
        return callback({
          code: 5, // NOT_FOUND
          message: "Todo not found",
        });
      }

      console.log("Todo found:", todo);
      callback(null, todo);
    } catch (error) {
      console.error("Error fetching todo:", error);
      callback({
        code: 13, // INTERNAL
        message: error instanceof Error ? error.message : "Error fetching todo",
      });
    }
  }

  async ListTodos(
    call: ServerUnaryCall<IListTodosRequest, IListTodosResponse>,
    callback: sendUnaryData<IListTodosResponse>
  ): Promise<void> {
    try {
      console.log("Received listTodos request:", call.request);
      const { page = 1, limit = 10 } = call.request;

      const result = await this.todoService.ListTodos(page, limit);
      console.log(`Found ${result.todos.length} todos`);
      callback(null, result);
    } catch (error) {
      console.error("Error listing todos:", error);
      callback({
        code: 13, // INTERNAL
        message: error instanceof Error ? error.message : "Error listing todos",
      });
    }
  }

  async UpdateTodo(
    call: ServerUnaryCall<IUpdateTodoRequest, ITodo>,
    callback: sendUnaryData<ITodo>
  ): Promise<void> {
    try {
      console.log("Received updateTodo request:", call.request);
      const { id, title, description, completed } = call.request;

      if (!id) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "ID is required",
        });
      }

      const todo = await this.todoService.UpdateTodo(id, {
        title,
        description,
        completed,
      });

      console.log("Todo updated successfully:", todo);
      callback(null, todo);
    } catch (error) {
      console.error("Error updating todo:", error);
      callback({
        code: 13, // INTERNAL
        message: error instanceof Error ? error.message : "Error updating todo",
      });
    }
  }

  async DeleteTodo(
    call: ServerUnaryCall<IDeleteTodoRequest, IDeleteTodoResponse>,
    callback: sendUnaryData<IDeleteTodoResponse>
  ): Promise<void> {
    try {
      console.log("Received deleteTodo request:", call.request);
      const { id } = call.request;

      if (!id) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: "ID is required",
        });
      }

      await this.todoService.DeleteTodo(id);
      console.log("Todo deleted successfully");
      callback(null, { success: true });
    } catch (error) {
      console.error("Error deleting todo:", error);
      callback({
        code: 13, // INTERNAL
        message: error instanceof Error ? error.message : "Error deleting todo",
      });
    }
  }
}
