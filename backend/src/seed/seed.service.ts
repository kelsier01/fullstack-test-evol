import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from '../task/entities/task.entity'; 
import { Tag } from '../tags/entities/tag.entity'; 

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
    @InjectModel(Tag)
    private readonly tagModel: typeof Tag,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  async seedDatabase() {
    try {
      const taskCount = await this.taskModel.count();
      if (taskCount > 0) {
        this.logger.log('La base de datos ya tiene datos (seed). Omitiendo.');
        return;
      }

      this.logger.log('Iniciando el sembrado (seed) de la base de datos...');

      const tagUrgente = await this.tagModel.create({ title: 'Urgente' });
      const tagHogar = await this.tagModel.create({ title: 'Hogar' });
      const tagTrabajo = await this.tagModel.create({ title: 'Trabajo' });
      this.logger.log('Tags creados.');

      const task1 = await this.taskModel.create({
        title: 'Completar la API RESTful',
        description: 'Terminar todos los endpoints de NestJS.',
        completed: false,
        eliminado: false,
      });

      const task2 = await this.taskModel.create({
        title: 'Hacer las compras del supermercado',
        description: 'Leche, huevos, y pan.',
        completed: false,
        eliminado: false,
        dueDate: "2025-11-03",
      });

      const task3 = await this.taskModel.create({
        title: 'Implementar el frontend en React',
        description: 'Conectar React con la API (ToDoPage).',
        completed: false,
        eliminado: false,
      });
      this.logger.log('Tasks creadas.');

      await task1.$add('tags', [tagUrgente, tagTrabajo]);
      
      await task2.$add('tags', tagHogar);
      
      await task3.$add('tags', tagTrabajo);
      
      this.logger.log('Tags asociados a las tareas.');

      this.logger.log('¡Sembrado (seed) completado con éxito!');
    } catch (error) {
      this.logger.error('Error durante el sembrado:', error);
    }
  }
}
