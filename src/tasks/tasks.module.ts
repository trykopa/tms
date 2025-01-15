import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from "../auth/auth.module";
import { TasksController } from './controllers/tasks.controller';
import { Task } from './entities/task.entity';
import { TasksGateway } from './gateways/tasks.gateway';
import { TasksService } from './services/tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksGateway],
})
export class TasksModule {}
