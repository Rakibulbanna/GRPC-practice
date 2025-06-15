import { PrismaClient } from "@prisma/client";
import { ITodo } from "../interfaces/todo.interface";

export class TodoService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async CreateTodo(title: string, description: string): Promise<ITodo> {
    const todo = await this.prisma.todo.create({
      data: {
        title,
        description,
        completed: false,
      },
    });

    return todo;
  }

  async GetTodo(id: number): Promise<ITodo | null> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) return null;

    return todo;
  }

  async ListTodos(
    page: number = 1,
    limit: number = 10
  ): Promise<{ todos: ITodo[]; total: number }> {
    const skip = (page - 1) * limit;
    const [todos, total] = await Promise.all([
      this.prisma.todo.findMany({
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.todo.count(),
    ]);

    return {
      todos,
      total,
    };
  }

  async UpdateTodo(
    id: number,
    data: { title?: string; description?: string; completed?: boolean }
  ): Promise<ITodo> {
    const todo = await this.prisma.todo.update({
      where: { id },
      data,
    });

    return todo;
  }

  async DeleteTodo(id: number): Promise<boolean> {
    await this.prisma.todo.delete({
      where: { id },
    });
    return true;
  }
}
