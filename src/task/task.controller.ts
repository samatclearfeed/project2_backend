import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { taskDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async postTask(@Request() request: any, @Body() taskDto: taskDto) {
    const userId = request.user.userId;
    if (!userId) {
      throw new UnauthorizedException('error fetch user profile!');
    }

    await this.taskService.postTask(userId, taskDto);

    return {
      message: 'successfully created task!',
    };
  }

  @Get()
  async getTasksByUserId(@Request() request: any) {
    const userId = request.user.userId;
    if (!userId) {
      throw new UnauthorizedException('error fetch user profile!');
    }

    const tasks = await this.taskService.getTasks(userId);

    return {
      message: 'successfully fetched tasks!',
      tasks: tasks,
    };
  }

  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: number, @Request() request: any) {
    const userId = request.user.userId;
    if (!userId) {
      throw new UnauthorizedException('error fetch user profile!');
    }

    const task = await this.taskService.getTaskById(taskId, userId);

    return {
      message: 'successfully fetched task!',
      task: task,
    };
  }

  @Patch(':taskId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async patchTask(
    @Param('taskId') taskId: number,
    @Request() request: any,
    @Body() taskDto: taskDto,
  ) {
    const userId = request.user.userId;
    if (!userId) {
      throw new UnauthorizedException('error fetch user profile!');
    }

    await this.taskService.patchTask(taskId, userId, taskDto);

    return {
      message: 'successfully updated task!',
    };
  }

  @Delete(':taskId')
  async deleteTask(@Param('taskId') taskId: number, @Request() request: any) {
    const userId = request.user.userId;
    if (!userId) {
      throw new UnauthorizedException('error fetch user profile!');
    }

    await this.taskService.deleteTask(taskId, userId);

    return {
      message: 'successfully deleted task!',
    };
  }
}
