import { TypeOrmModule } from "@nestjs/typeorm";
import { ActivityLogService } from "./activity-log.service";
import { ActivityLogController } from "./activity-log.controller";
import { Module } from "@nestjs/common";
import { ActivityLog } from "./actiity-log.entity";



@Module({
    imports: [TypeOrmModule.forFeature([ActivityLog])],
    providers:[ActivityLogService],
    controllers: [ActivityLogController],
    exports: [ActivityLogService]
})
export class ActivityLogModule {}