import { Table, Column, Model, DataType, BelongsToMany, AllowNull } from 'sequelize-typescript';
import { Tag } from "../../tags/entities/tag.entity";
import { TaskTag } from "../../tasktag/task-tag.entity"; 
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

@Table({
  tableName: 'tasks',
  timestamps: true,
})
export class Task extends Model<
  InferAttributes<Task>,
  InferCreationAttributes<Task>
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>; 

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare completed: CreationOptional<boolean>;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare dueDate: CreationOptional<string | null>; 

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  declare eliminado: CreationOptional<boolean>;

  @BelongsToMany(() => Tag, () => TaskTag)
  declare tags: CreationOptional<Tag[]>;
}