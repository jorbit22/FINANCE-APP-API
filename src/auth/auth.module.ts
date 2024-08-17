import { JwtModule } from "@nestjs/jwt";
import { AuthGuard } from "./auth.guard";
import { Module } from "@nestjs/common";


@Module({
    imports: [JwtModule.register({secret: process.env.JWT_SECRET})],
    providers: [AuthGuard],
    exports: [AuthGuard]
})

export class AuthModule{}