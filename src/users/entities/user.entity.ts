import { ActivityLog } from "src/activity-log/actiity-log.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

     @Column()
     firstName: string;

     @Column()
     lastName:string

     @Column({nullable: true})
     refreshToken: string | null;

     @Column({type: 'timestamp', nullable: true})
     deletedAt: Date | null;

     @OneToMany(() => ActivityLog, activityLog => activityLog.user)
     activityLogs: ActivityLog[]

     @Column({type:'varchar', length: 255, nullable: true})
     profileImageUrl?: string;
}