import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports:[ TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: process.env.JWT_SECRET || 'defaultsecret',
    signOptions: { expiresIn: '1h' }
  }),
  ActivityLogModule,
  CloudinaryModule
  
],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
