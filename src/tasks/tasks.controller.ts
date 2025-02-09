import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/dot/create-task.dot';
import { UpdateTaskDto } from 'src/dot/update-task.dot';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/auth.entity';
import { Task } from './task.entity';
import { Pagination } from '@supabase/supabase-js';
import { PaginationDto } from 'src/dot/pagination.dto';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }
  @Get()
  getAllTasks(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getAllTasks(user, paginationDto);
  }
  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.tasksService.removeTask(id, user);
  }

  @Put(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }
}
