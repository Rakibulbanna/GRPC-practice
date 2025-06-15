import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

const PROTO_PATH = path.join(__dirname, "../proto/todo.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateTodoRequest {
  title: string;
  description: string;
}

interface GetTodoRequest {
  id: number;
}

interface ListTodosRequest {
  page?: number;
  limit?: number;
}

interface ListTodosResponse {
  todos: Todo[];
  total: number;
}

interface UpdateTodoRequest {
  id: number;
  title?: string;
  description?: string;
  completed?: boolean;
}

interface DeleteTodoRequest {
  id: number;
}

interface DeleteTodoResponse {
  success: boolean;
}

interface TodoService {
  service: {
    createTodo: grpc.MethodDefinition<CreateTodoRequest, Todo>;
    getTodo: grpc.MethodDefinition<GetTodoRequest, Todo>;
    listTodos: grpc.MethodDefinition<ListTodosRequest, ListTodosResponse>;
    updateTodo: grpc.MethodDefinition<UpdateTodoRequest, Todo>;
    deleteTodo: grpc.MethodDefinition<DeleteTodoRequest, DeleteTodoResponse>;
  };
}

const protoDescriptor = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as {
  todo: {
    TodoService: TodoService;
  };
};
const todoService = protoDescriptor.todo.TodoService;

const server = new grpc.Server();

server.addService(todoService.service, {
  createTodo: async (
    call: grpc.ServerUnaryCall<CreateTodoRequest, Todo>,
    callback: grpc.sendUnaryData<Todo>
  ) => {
    try {
      console.log("Received createTodo request:", call.request);
      const { title, description } = call.request;

      if (!title || !description) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: "Title and description are required",
        });
      }

      const todo = await prisma.todo.create({
        data: {
          title,
          description,
        },
      });

      console.log("Todo created successfully:", todo);
      callback(null, {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        created_at: todo.created_at.toISOString(),
        updated_at: todo.updated_at.toISOString(),
      });
    } catch (error) {
      console.error("Error creating todo:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : "Error creating todo",
      });
    }
  },

  getTodo: async (
    call: grpc.ServerUnaryCall<GetTodoRequest, Todo>,
    callback: grpc.sendUnaryData<Todo>
  ) => {
    try {
      console.log("Received getTodo request:", call.request);
      const { id } = call.request;

      if (!id) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: "ID is required",
        });
      }

      const todo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!todo) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: "Todo not found",
        });
      }

      console.log("Todo found:", todo);
      callback(null, {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        created_at: todo.created_at.toISOString(),
        updated_at: todo.updated_at.toISOString(),
      });
    } catch (error) {
      console.error("Error fetching todo:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : "Error fetching todo",
      });
    }
  },

  listTodos: async (
    call: grpc.ServerUnaryCall<ListTodosRequest, ListTodosResponse>,
    callback: grpc.sendUnaryData<ListTodosResponse>
  ) => {
    try {
      console.log("Received listTodos request:", call.request);
      const { page = 1, limit = 10 } = call.request;
      const skip = (page - 1) * limit;

      const [todos, total] = await Promise.all([
        prisma.todo.findMany({
          skip,
          take: limit,
          orderBy: { created_at: "desc" },
        }),
        prisma.todo.count(),
      ]);

      console.log(`Found ${todos.length} todos`);
      callback(null, {
        todos: todos.map((todo) => ({
          id: todo.id,
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          created_at: todo.created_at.toISOString(),
          updated_at: todo.updated_at.toISOString(),
        })),
        total,
      });
    } catch (error) {
      console.error("Error listing todos:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : "Error listing todos",
      });
    }
  },

  updateTodo: async (
    call: grpc.ServerUnaryCall<UpdateTodoRequest, Todo>,
    callback: grpc.sendUnaryData<Todo>
  ) => {
    try {
      console.log("Received updateTodo request:", call.request);
      const { id, title, description, completed } = call.request;

      if (!id) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: "ID is required",
        });
      }

      const todo = await prisma.todo.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(completed !== undefined && { completed }),
        },
      });

      console.log("Todo updated successfully:", todo);
      callback(null, {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        created_at: todo.created_at.toISOString(),
        updated_at: todo.updated_at.toISOString(),
      });
    } catch (error) {
      console.error("Error updating todo:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : "Error updating todo",
      });
    }
  },

  deleteTodo: async (
    call: grpc.ServerUnaryCall<DeleteTodoRequest, DeleteTodoResponse>,
    callback: grpc.sendUnaryData<DeleteTodoResponse>
  ) => {
    try {
      console.log("Received deleteTodo request:", call.request);
      const { id } = call.request;

      if (!id) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: "ID is required",
        });
      }

      await prisma.todo.delete({
        where: { id },
      });

      console.log("Todo deleted successfully");
      callback(null, { success: true });
    } catch (error) {
      console.error("Error deleting todo:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : "Error deleting todo",
      });
    }
  },
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Error starting server:", error);
      return;
    }
    server.start();
    console.log(`gRPC server running on port ${port}`);
  }
);
