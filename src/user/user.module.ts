import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { User } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'mysecret',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
