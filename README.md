# Task Management System with Real-Time Updates

A NestJS-based task management system with real-time updates using WebSocket.

## Features

- CRUD operations for tasks
- Real-time updates using WebSocket
- Pagination and filtering
- Input validation using DTOs
- Global exception handling
- Swagger API documentation
- TypeScript support
- SQLite database (file-based, no separate server needed)

## Prerequisites

- Node.js (v14 or later)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
NODE_ENV=development
JWT_SECRET=your-secret-key # Generate a random key
REFRESH_TOKEN_SECRET=your-refresh-token-key # Generate a random key
DB_DATABASE=db/tasks.db
```

4. Create the database directory:
```bash
mkdir db
```

## Running the Application

1. Start the development server:
```bash
npm run start:dev
```

2. The application will be available at:
- REST API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api
- WebSocket endpoint: ws://localhost:3000/tasks

## API Endpoints

### Tasks

- `GET /tasks` - Get all tasks (with pagination and filtering)
- `GET /tasks/:id` - Get a specific task
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Query Parameters

- `page` - Page number (default: 1)
- `limit` - Number of items per page (default: 10)
- `status` - Filter tasks by status (optional: 'pending', 'in-progress', 'completed')

## WebSocket Events

### Server to Client Events

- `taskCreated` - Emitted when a new task is created
- `taskUpdated` - Emitted when a task is updated
- `taskDeleted` - Emitted when a task is deleted

### WebSocket Client Example

```typescript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000/tasks');

// Connection event handlers
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

// Task event handlers
socket.on('taskCreated', (task) => {
  console.log('New task created:', task);
});

socket.on('taskUpdated', (task) => {
  console.log('Task updated:', task);
});

socket.on('taskDeleted', (taskId) => {
  console.log('Task deleted:', taskId);
});
```

## Project Structure

```
src/
├── common/
│   └── filters/
│       └── global-exception.filter.ts
├── tasks/
│   ├── controllers/
│   │   └── tasks.controller.ts
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   ├── update-task.dto.ts
│   │   └── pagination.dto.ts
│   ├── entities/
│   │   └── task.entity.ts
│   ├── enums/
│   │   └── task-status.enum.ts
│   ├── gateways/
│   │   └── tasks.gateway.ts
│   ├── services/
│   │   └── tasks.service.ts
│   └── tasks.module.ts
├── app.module.ts
└── main.ts
```

## Architecture Decisions

1. **SOLID Principles**:
   - Single Responsibility Principle: Each class has a single responsibility
   - Open/Closed Principle: New functionality can be added without modifying existing code
   - Interface Segregation: Clean interfaces for DTOs and entities
   - Dependency Inversion: Dependencies are injected and abstracted

2. **Design Patterns**:
   - Repository Pattern: TypeORM repositories for data access
   - Gateway Pattern: WebSocket gateway for real-time updates
   - DTO Pattern: Separate DTOs for input validation
   - Filter Pattern: Global exception filter for error handling

3. **Best Practices**:
   - Input validation using class-validator
   - Swagger documentation for API endpoints
   - TypeScript decorators for metadata
   - Environment configuration using dotenv
   - Proper error handling and logging
   - Pagination for large datasets
   - Real-time updates using WebSocket

## Scripts

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  }
}
```

## Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Test coverage
npm run test:cov
```

## Deployment Considerations

1. **Environment Variables**:
   - Use proper environment variables for production
   - Never commit sensitive information
   - Use secrets management in production

2. **Database**:
   - Set `synchronize: false` in production
   - Use migrations for database changes
   - Consider connection pooling

3. **WebSocket**:
   - Implement authentication if needed
   - Consider using Redis for scaling WebSocket
   - Handle reconnection strategies

4. **Security**:
   - Implement rate limiting
   - Add request validation
   - Use CORS properly
   - Enable HTTPS in production

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
