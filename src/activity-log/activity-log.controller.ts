import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ActivityLogService } from "./activity-log.service";


@Controller('activity-logs') 
export class ActivityLogController {
    constructor(private readonly activityLogService: ActivityLogService) {}

    @Get('user/:id') 
    async getLogsForUser(@Param('id', ParseIntPipe) userId: number) {
        return this.activityLogService.getLogsForUser(userId)
    }
}