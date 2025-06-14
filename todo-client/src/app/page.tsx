"use client";

import { useState, useEffect } from "react";
import { todoClient, Todo } from "../services/grpc";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await todoClient.listTodos({ page: 1, limit: 10 });
      setTodos(response.todos);
      setError(null);
    } catch (err) {
      setError("Failed to load todos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const todo = await todoClient.createTodo(newTodo);
      setTodos([todo, ...todos]);
      setNewTodo({ title: "", description: "" });
      setError(null);
    } catch (err) {
      setError("Failed to create todo");
      console.error(err);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const updatedTodo = await todoClient.updateTodo({
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
      setError(null);
    } catch (err) {
      setError("Failed to update todo");
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoClient.deleteTodo({ id });
      setTodos(todos.filter((todo) => todo.id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Todo List</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleCreateTodo}
          className="mb-8 bg-white p-6 rounded-lg shadow"
        >
          <h2 className="text-2xl font-semibold mb-4">Add New Todo</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Todo
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white p-6 rounded-lg shadow flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggleTodo(todo)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <h3
                      className={`text-lg font-medium ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {todo.title}
                    </h3>
                  </div>
                  <p
                    className={`mt-2 ${
                      todo.completed ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    {todo.description}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Created: {new Date(todo.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
