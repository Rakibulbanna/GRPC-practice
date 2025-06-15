import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

import { TodoController } from "./controllers/todo.controller";
import { ProtoGrpcType } from "./generated/todo";

const PROTO_PATH = path.join(process.cwd(), "proto/todo.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;
const todoService = proto.todo.TodoService;

const server = new grpc.Server();
const todoController = new TodoController();

server.addService(todoService.service, todoController);

// Handle process termination
process.on("SIGTERM", () => {
  server.tryShutdown(() => {
    console.log("Server shutdown complete");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  server.tryShutdown(() => {
    console.log("Server shutdown complete");
    process.exit(0);
  });
});

// Handle nodemon restart
process.on("SIGUSR2", () => {
  server.tryShutdown(() => {
    console.log("Server shutdown complete");
    process.exit(0);
  });
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
