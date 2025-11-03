import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag)
    private tagModel: typeof Tag,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      return await this.tagModel.create(createTagDto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException(
          `El tag con título '${createTagDto.title}' ya existe.`,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Tag[]> {
    return this.tagModel.findAll();
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagModel.findByPk(id);
    if (!tag) {
      throw new NotFoundException(`Tag con id ${id} no encontrado`);
    }
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);
    try {
      await tag.update(updateTagDto);
      return tag;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException(
          `El tag con título '${updateTagDto.title}' ya existe.`,
        );
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await tag.destroy();
  }
}