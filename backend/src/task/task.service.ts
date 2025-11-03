// src/task/task.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TagsService } from 'src/tags/tags.service';
import { Tag } from 'src/tags/entities/tag.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
    private readonly tagsService: TagsService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskModel.create(createTaskDto);
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.findAll({
      where:{
        eliminado: false,
      },
      include: [Tag]
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    
    await task.update(updateTaskDto);
    return task;
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await task.destroy();
  }

  async addTagToTask(taskId: number, tagId: number): Promise<Task> {
    const task = await this.findOne(taskId);
    const tag = await this.tagsService.findOne(tagId); 

    await task.$add('tags', tag); 
    return this.findOneWithTags(taskId);
  }

  // Método auxiliar para ver las relaciones
  async findOneWithTags(id: number): Promise<Task> {
    const task = await this.taskModel.findByPk(id, {
      include: [Tag],
    });
    if (!task) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada`);
    }
    return task;
  }

  async removeTagFromTask(taskId: number, tagId: number): Promise<void> {
    const task = await this.findOne(taskId);
    const tag = await this.tagsService.findOne(tagId);
    await task.$remove('tags', tag.id);
  }
}