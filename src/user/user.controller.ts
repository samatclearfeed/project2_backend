import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { loginDto, userDto } from './user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async postUser(@Body() userDto: userDto) {
    // orverwriting `userDto.password` with the hashed password.
    userDto.password = await bcrypt.hash(userDto.password, 10);

    // storing the user data to DB.
    await this.userService.postUser(userDto);
    return {
      message: 'successfully created user!',
    };
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: loginDto) {
    // user: storing the `user` if exists.
    const user = await this.userService.getUser(loginDto);

    // check: the password recieved with that of the database.
    const authenticated = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!authenticated) {
      throw new UnauthorizedException('email or password does not match');
    }

    // jwtPayload: payload for the token.
    const jwtPayload = { userId: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(jwtPayload);

    // return: message with the generated token.
    return {
      message: 'user authorized!',
      token: accessToken,
    };
  }
}
