export interface TodoData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListTodosResponse {
  todos: TodoData[];
  total: number;
}

const convertToTodoData = (todo: Todo): TodoData => ({
  id: todo.id,
  title: todo.title,
  description: todo.description,
  completed: todo.completed,
  created_at: todo.created_at,
  updated_at: todo.updated_at,
});

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (
  url: string,
  options?: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying request to ${url}, ${retries} attempts remaining`);
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

export const todoClient = {
  createTodo: async (request: {
    title: string;
    description: string;
  }): Promise<TodoData> => {
    console.log("Creating todo with request:", request);
    try {
      const response = await fetchWithRetry("/grpc/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const data = await response.json();
      console.log("Todo created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  },

  getTodo: async (request: { id: number }): Promise<TodoData> => {
    console.log("Getting todo with id:", request.id);
    try {
      const response = await fetchWithRetry(`/grpc/todos?id=${request.id}`);
      const data = await response.json();
      console.log("Todo retrieved successfully:", data);
      return data;
    } catch (error) {
      console.error("Error getting todo:", error);
      throw error;
    }
  },

  listTodos: async (request: {
    page: number;
    limit: number;
  }): Promise<ListTodosResponse> => {
    console.log("Listing todos with request:", request);
    try {
      const response = await fetchWithRetry(
        `/grpc/todos?page=${request.page}&limit=${request.limit}`
      );
      const data = await response.json();
      console.log("Todos listed successfully:", data);
      return data;
    } catch (error) {
      console.error("Error listing todos:", error);
      throw error;
    }
  },

  updateTodo: async (request: {
    id: number;
    title?: string;
    description?: string;
    completed?: boolean;
  }): Promise<TodoData> => {
    console.log("Updating todo with request:", request);
    try {
      const response = await fetchWithRetry("/grpc/todos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const data = await response.json();
      console.log("Todo updated successfully:", data);
      return data;
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  },

  deleteTodo: async (request: {
    id: number;
  }): Promise<{ success: boolean }> => {
    console.log("Deleting todo with id:", request.id);
    try {
      const response = await fetchWithRetry(`/grpc/todos?id=${request.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log("Todo deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  },
};
