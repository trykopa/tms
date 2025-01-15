import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateTaskDto } from '../dto/create-task.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';
import { TasksGateway } from '../gateways/tasks.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly tasksGateway: TasksGateway,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    const savedTask = await this.taskRepository.save(task);
    this.tasksGateway.notifyTaskCreated(savedTask);
    return savedTask;
  }

  async findAll(paginationDto: PaginationDto): Promise<[Task[], number]> {
    const { page = 1, limit = 10, status } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    if (status) {
      queryBuilder.where('task.status = :status', { status });
    }

    return queryBuilder
      .orderBy('task.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    const updatedTask = Object.assign(task, updateTaskDto);
    const savedTask = await this.taskRepository.save(updatedTask);
    this.tasksGateway.notifyTaskUpdated(savedTask);
    return savedTask;
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
    this.tasksGateway.notifyTaskDeleted(id);
  }
}
