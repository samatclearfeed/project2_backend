import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { loginDto, userDto } from './user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getUser(loginDto: loginDto) {
    const user = await this.userModel.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('email or password does not match');
    }

    return user;
  }

  async postUser(userDto: userDto) {
    await this.userModel.create(userDto).catch((error) => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('User already exists');
      }
      throw error;
    });

    return;
  }
}
