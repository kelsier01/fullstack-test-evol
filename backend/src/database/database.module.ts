import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
        dialect: configService.getOrThrow<Dialect>('DB_DIALECT'),
        host: configService.getOrThrow<string>('DB_HOST'),
        port: configService.getOrThrow<number>('DB_PORT'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_DATABASE'),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        autoLoadModels: true,
        synchronize: true,
        sync: { alter: true },
      }),
    }),
  ],
})
export class DatabaseModule {}