# gRPC Todo Application

A CRUD application built with gRPC, Node.js, MySQL, and Prisma ORM.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your MySQL connection string:

   ```
   DATABASE_URL="mysql://user:password@localhost:3306/todo_db"
   ```

4. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

5. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

## Running the Application

1. Start the gRPC server:

   ```bash
   npm run dev
   ```

2. In a separate terminal, run the client:
   ```bash
   npm run build
   node dist/client.js
   ```

## Testing

Run the test suite:

```bash
npm test
```

## Project Structure

- `proto/` - Contains the Protocol Buffer definitions
- `src/` - Source code
  - `server.ts` - gRPC server implementation
  - `client.ts` - gRPC client implementation
  - `__tests__/` - Test files
- `prisma/` - Prisma schema and migrations

## API Endpoints

The service provides the following gRPC methods:

- `CreateTodo` - Create a new todo
- `GetTodo` - Get a todo by ID
- `ListTodos` - List all todos with pagination
- `UpdateTodo` - Update a todo
- `DeleteTodo` - Delete a todo

## Error Handling

The service includes proper error handling for:

- Not Found (404)
- Internal Server Error (500)
- Invalid Input (400)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
