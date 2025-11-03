import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from '../task/entities/task.entity';
import { Tag } from '../tags/entities/tag.entity'; 

@Module({
  imports: [
    SequelizeModule.forFeature([Task, Tag]), 
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
