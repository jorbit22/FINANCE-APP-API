import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true
    }),
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret',
      signOptions: { expiresIn: '1h' }
    })
    
  ],
})
export class AppModule {}
