import { NextResponse } from "next/server";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

// Fix the proto file path to use the public directory
const PROTO_PATH = path.join(process.cwd(), "public/proto/todo.proto");

console.log("Loading proto file from:", PROTO_PATH);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;
const client = new proto.todo.TodoService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// Add connection timeout
const deadline = new Date();
deadline.setSeconds(deadline.getSeconds() + 5);
client.waitForReady(deadline, (error: any) => {
  if (error) {
    console.error("Failed to connect to gRPC server:", error);
  } else {
    console.log("Connected to gRPC server successfully");
  }
});

const promisify = (method: any) => {
  return (request: any) => {
    return new Promise((resolve, reject) => {
      method.call(client, request, (error: any, response: any) => {
        if (error) {
          console.error("gRPC error:", error);
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    console.log("GET /grpc/todos - Request params:", { id, page, limit });

    if (id) {
      const todo = await promisify(client.getTodo)({ id: parseInt(id) });
      console.log("GET /grpc/todos - Todo found:", todo);
      return NextResponse.json(todo);
    } else {
      const response = await promisify(client.listTodos)({ page, limit });
      console.log("GET /grpc/todos - List response:", response);
      return NextResponse.json(response);
    }
  } catch (error) {
    console.error("Error in GET /grpc/todos:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received POST request body:", body);

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const todo = await promisify(client.createTodo)(body);
    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error in POST /grpc/todos:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log("Received PUT request body:", body);

    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const todo = await promisify(client.updateTodo)(body);
    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error in PUT /grpc/todos:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const response = await promisify(client.deleteTodo)({ id: parseInt(id) });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in DELETE /grpc/todos:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
