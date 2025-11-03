import { IsInt, IsNotEmpty } from 'class-validator';

export class AddTagDto {
  @IsInt({ message: 'El tagId debe ser un número entero' })
  @IsNotEmpty({ message: 'El tagId no puede estar vacío' })
  tagId: number;
}