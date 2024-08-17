import { timeStamp } from "console";
import { User } from "src/users/entities/user.entity";
import { Entity, Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"


@Entity()
export class ActivityLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.activityLogs)
    user: User;

    @Column()
    action: string;

    @CreateDateColumn()
    timeStamp: Date;



}    