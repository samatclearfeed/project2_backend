import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { taskDto } from './task.dto';
import { Task } from './task.model';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task) private taskModel: typeof Task) {}

  async postTask(userId: number, taskDto: taskDto) {
    await this.taskModel.create({ ...taskDto, user_id: userId });

    return;
  }

  async getTasks(userId: number) {
    const tasks = await this.taskModel.findAll({ where: { user_id: userId } });

    return tasks;
  }

  async getTaskById(taskId: number, userId: number) {
    const task = await this.taskModel.findOne({
      where: { id: taskId, user_id: userId },
    });
    if (!task) {
      throw new NotFoundException('task not found!');
    }

    return task;
  }

  async patchTask(taskId: number, userId: number, taskDto: taskDto) {
    // check: if task exists.
    const task = await this.taskModel.findOne({
      where: { id: taskId, user_id: userId },
    });
    if (!task) {
      throw new NotFoundException('task not found!');
    }

    await this.taskModel.update(taskDto, { where: { id: taskId } });

    return;
  }

  async deleteTask(taskId: number, userId: number) {
    const tasksDeleted = await this.taskModel.destroy({
      where: { id: taskId, user_id: userId },
    });

    // check: if the task is deleted.
    if (tasksDeleted === 0) {
      throw new NotFoundException('task not found!');
    }

    return;
  }
}
