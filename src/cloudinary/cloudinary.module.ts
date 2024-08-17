import { ConfigModule } from "@nestjs/config";
import { CloudinaryService } from "./cloudinary.service";
import { Module } from "@nestjs/common";


@Module({
    imports: [ConfigModule],
    providers: [CloudinaryService],
    exports: [CloudinaryService],
})
export class CloudinaryModule{}