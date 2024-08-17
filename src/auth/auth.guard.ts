import { ExecutionContext, CanActivate, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const authHeader = request.headers['authorization']

        if(!authHeader  || !authHeader.startsWith('Bearer') ) {
            throw new UnauthorizedException('No token provided')
        }

        const token = authHeader.split(' ')[1]
        try {
            const user = this.jwtService.verify(token)
            request.user = user
            return true
        } catch (error) {
            throw new UnauthorizedException('invalid token')
        }
    }
}