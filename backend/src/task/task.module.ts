import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { TagsModule } from 'src/tags/tags.module';
import { TaskTag } from 'src/tasktag/task-tag.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Task,
      TaskTag
    ]),
    TagsModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
