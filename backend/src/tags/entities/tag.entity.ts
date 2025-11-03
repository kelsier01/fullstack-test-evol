import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Task } from '../../task/entities/task.entity';
import { TaskTag } from '../../tasktag/task-tag.entity';

@Table({
  tableName: 'tags',
  timestamps: true,
})
export class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
  
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare title: string;

  @BelongsToMany(() => Task, () => TaskTag)
  declare tasks: CreationOptional<Task[]>;
}