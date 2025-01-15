import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Task } from '../entities/task.entity';
import { TaskStatus } from '../enums/task-status.enum';
import { TasksGateway } from '../gateways/tasks.gateway';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<Task>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let gateway: TasksGateway;

  const mockTask: Task = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTasksGateway = {
    notifyTaskCreated: jest.fn(),
    notifyTaskUpdated: jest.fn(),
    notifyTaskDeleted: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
        {
          provide: TasksGateway,
          useValue: mockTasksGateway,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
    gateway = module.get<TasksGateway>(TasksGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task and notify via WebSocket', async () => {
      const createTaskDto = {
        title: 'New Task',
        description: 'New Description',
      };

      mockRepository.create.mockReturnValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(mockTask);
      expect(mockRepository.create).toHaveBeenCalledWith(createTaskDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
      expect(mockTasksGateway.notifyTaskCreated).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const expectedResult: [Task[], number] = [[mockTask], 1];

      mockRepository.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue(expectedResult),
      });

      const result = await service.findAll(paginationDto);

      expect(result).toEqual(expectedResult);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should filter tasks by status', async () => {
      const paginationDto = {
        page: 1,
        limit: 10,
        status: TaskStatus.PENDING,
      };
      const expectedResult: [Task[], number] = [[mockTask], 1];

      mockRepository
        .createQueryBuilder()
        .getManyAndCount.mockResolvedValue(expectedResult);

      const result = await service.findAll(paginationDto);

      expect(result).toEqual(expectedResult);
      expect(mockRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        'task.status = :status',
        { status: TaskStatus.PENDING },
      );
    });
  });

  describe('findOne', () => {
    it('should return a task if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(mockTask.id);

      expect(result).toEqual(mockTask);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTask.id },
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a task and notify via WebSocket', async () => {
      const updateTaskDto = {
        status: TaskStatus.IN_PROGRESS,
      };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue({
        ...mockTask,
        ...updateTaskDto,
      });

      const result = await service.update(mockTask.id, updateTaskDto);

      expect(result).toEqual({
        ...mockTask,
        ...updateTaskDto,
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockTasksGateway.notifyTaskUpdated).toHaveBeenCalled();
    });

    it('should throw NotFoundException if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { status: TaskStatus.IN_PROGRESS }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a task and notify via WebSocket', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.remove.mockResolvedValue(mockTask);

      await service.remove(mockTask.id);

      expect(mockRepository.remove).toHaveBeenCalledWith(mockTask);
      expect(mockTasksGateway.notifyTaskDeleted).toHaveBeenCalledWith(
        mockTask.id,
      );
    });

    it('should throw NotFoundException if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
