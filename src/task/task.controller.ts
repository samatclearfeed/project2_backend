import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { taskDto } from './task.dto';
import { TaskService } from './task.service';

@Controller('users/:userId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async postTask(@Param('userId') userId: number, @Body() taskDto: taskDto) {
    await this.taskService.postTask(userId, taskDto);

    return {
      message: 'successfully created task!',
    };
  }

  @Get()
  async getTasksByUserId(@Param('userId') userId: number) {
    const tasks = await this.taskService.getTasks(userId);

    return {
      message: 'successfully fetched tasks!',
      tasks: tasks,
    };
  }

  @Get(':taskId')
  async getTaskById(
    @Param('taskId') taskId: number,
    @Param('userId') userId: number,
  ) {
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
    @Param('userId') userId: number,
    @Body() taskDto: taskDto,
  ) {
    await this.taskService.patchTask(taskId, userId, taskDto);

    return {
      message: 'successfully updated task!',
    };
  }

  @Delete(':taskId')
  async deleteTask(
    @Param('taskId') taskId: number,
    @Param('userId') userId: number,
  ) {
    await this.taskService.deleteTask(taskId, userId);

    return {
      message: 'successfully deleted task!',
    };
  }
}
