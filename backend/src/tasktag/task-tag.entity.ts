import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { Task } from '../task/entities/task.entity';
import { Tag } from '../tags/entities/tag.entity';

@Table({
  tableName: 'task_has_tags',
  timestamps: false,
})
export class TaskTag extends Model<TaskTag> {
  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare task_id: number;

  @ForeignKey(() => Tag)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare tag_id: number;

}