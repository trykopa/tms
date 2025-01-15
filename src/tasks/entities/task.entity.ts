import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TaskStatus } from '../enums/task-status.enum';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  //SQLite does not support ENUM type, so we will use a string type instead
  @Column({ type: 'text', default: TaskStatus.PENDING })
  status: TaskStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
