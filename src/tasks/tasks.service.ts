import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from 'src/dot/create-task.dot';
import { UpdateTaskDto } from 'src/dot/update-task.dot';
import { User } from 'src/auth/auth.entity';
import { number } from '@hapi/joi';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const newTask = this.tasksRepository.create({
      ...createTaskDto,
      user: user,
    });
    return await this.tasksRepository.save(newTask);
  }

  async getAllTasks(user: User): Promise<Task[]> {
    return this.tasksRepository.find({ where: { user: { id: user.id } } });
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async removeTask(id: number, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({
      id,
      user: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
    return;
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const { title, description, status } = updateTaskDto;
    const task = await this.getTaskById(id, user);
    task.title = title;
    task.description = description;
    task.status = status;
    const deletedTask = await this.tasksRepository.save(task);
    if (!deletedTask) {
      throw new NotFoundException(`Task with ${id} not found`);
    } else {
      return deletedTask;
    }
  }
}
