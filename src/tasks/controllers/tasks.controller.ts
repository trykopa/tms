import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe, UseGuards
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

import { AuthGuard } from '../../common/guards/auth.guard';
import { CreateTaskDto } from '../dto/create-task.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TasksService } from '../services/tasks.service';

@ApiTags('tasks')
@ApiBearerAuth('access_token')
@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with pagination' })
  @ApiResponse({ status: 200, description: 'Return all tasks' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tasksService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: 200, description: 'Return the task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
