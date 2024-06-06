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
    // check: if user exists.
    const user = await this.userModel.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('email or password does not match');
    }

    // return: `user` if exists.
    return user;
  }

  async postUser(userDto: userDto) {
    // creating a new entry for the user. checking the `unique` constraint as well.
    await this.userModel.create(userDto).catch((error) => {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('User already exists');
      }
      throw error;
    });

    // return: pointing the end of the function.
    return;
  }
}
