import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

// DECLARATION OF ENUMS
export enum statusType {
  open = 'open',
  inProgress = 'in progress',
  closed = 'closed',
}

// DECLARATION OF DTOs
export class taskDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(statusType)
  readonly status: statusType;
}
