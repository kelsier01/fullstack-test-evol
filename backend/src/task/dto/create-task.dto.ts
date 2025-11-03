import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsISO8601, isString } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  title: string;

  @IsString({ message: 'La descripcion tiene que ser un texto'})
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  description: string;

  @IsBoolean({ message: 'El estado tiene que ser un booleano'})
  @IsOptional({ message: 'El valor por defecto es false'})
  completed: boolean

  @IsString({ message: "Es string"})
  @IsOptional() 
  dueDate?: string;

  @IsBoolean({ message: 'El estado tiene que ser un booleano'})
  @IsOptional()
  eliminado?: boolean;
}