import { Table, Model, Column, DataType } from 'sequelize-typescript';
import { statusType } from './task.dto';

@Table
export class Task extends Model<Task> {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.ENUM,
    values: ['open', 'in progress', 'closed'],
    allowNull: false,
  })
  status: statusType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({
    field: 'created_at',
    type: DataType.DATE,
  })
  createdAt: Date;

  @Column({
    field: 'updated_at',
    type: DataType.DATE,
  })
  updatedAt: Date;

  @Column({
    field: 'deleted_at',
    type: DataType.DATE,
  })
  deletedAt: Date;
}
