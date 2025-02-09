import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from 'src/dot/create-task.dot';
import { UpdateTaskDto } from 'src/dot/update-task.dot';
import { User } from 'src/auth/auth.entity';
import { number } from '@hapi/joi';
import { PaginationDto } from 'src/dot/pagination.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const lastTask = await this.tasksRepository.findOne({
      where: { user_id: user.id },
      order: { task_number: 'DESC' },
    });
    const nextTaskNumber = lastTask ? lastTask.task_number + 1 : 1;

    const newTask = this.tasksRepository.create({
      ...createTaskDto,
      user_id: user.id,
      user: user,
      task_number: nextTaskNumber,
    });
    return await this.tasksRepository.save(newTask);
  }

  async getAllTasks(user: User, paginationDto: PaginationDto): Promise<Task[]> {
    const { limit, offset } = paginationDto;
    return this.tasksRepository.find({
      where: { user_id: user.id },
      skip: offset,
      take: limit ?? 10,
    });
  }

  async getTaskById(task_number: number, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { user_id: user.id, task_number },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async removeTask(task_number: number, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({
      task_number,
      user_id: user.id,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
    return;
  }

  async updateTask(
    task_number: number,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description, status } = updateTaskDto;
    const task = await this.getTaskById(task_number, user);
    task.title = title;
    task.description = description;
    task.status = status;
    const deletedTask = await this.tasksRepository.save(task);
    if (!deletedTask) {
      throw new NotFoundException(`Task with ${task_number} not found`);
    } else {
      return deletedTask;
    }
  }
}
