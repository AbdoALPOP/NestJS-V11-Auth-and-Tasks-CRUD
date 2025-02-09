import { Exclude } from 'class-transformer';
import { User } from 'src/auth/auth.entity';
import { RegistryDates } from 'src/embedded/registry-dates.embedded';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryColumn()
  task_number: number;
  @PrimaryColumn()
  user_id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  status: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // default: () => 'CURRENT_TIMESTAMP'
  // created_at: Date;

  @Column(() => RegistryDates, { prefix: false })
  registy_date: RegistryDates;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
