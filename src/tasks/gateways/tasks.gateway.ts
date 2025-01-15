import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { User } from '../../users/entities/user.entity';
import { Task } from '../entities/task.entity';
import { TaskEvents } from '../enums/tasks.events';

@WebSocketGateway({
  path: '/api/ws',
  namespace: 'tasks',
  cors: {
    origin: '*',
  },
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;

      if (!token) {
        client.disconnect();
        return;
      }

      client.data.user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      }) as User;
      this.connectedClients.set(client.id, client);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  notifyTaskCreated(task: Task) {
    this.server.emit(TaskEvents.CREATED, task);
  }

  notifyTaskUpdated(task: Task) {
    this.server.emit(TaskEvents.UPDATED, task);
  }

  notifyTaskDeleted(taskId: string) {
    this.server.emit(TaskEvents.DELETED, taskId);
  }
}
