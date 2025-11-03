import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  title: string;
}