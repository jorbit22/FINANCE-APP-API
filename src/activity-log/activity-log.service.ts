import { InjectRepository } from "@nestjs/typeorm";
import { ActivityLog } from "./actiity-log.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";


@Injectable()
export class ActivityLogService {
    constructor(
        @InjectRepository(ActivityLog)
        private activityLogRepository: Repository<ActivityLog>,
    ) {}

    async createLog(log: {user: User, action: string, timeStamp: Date}) : Promise<ActivityLog> {
        const activityLog = this.activityLogRepository.create(log)
    
        return this.activityLogRepository.save(activityLog)
    }

    async getLogsForUser(userId: number): Promise<ActivityLog[]> {
        return this.activityLogRepository.find({where: {user: {id: userId}}})
    }
}