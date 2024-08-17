import { Body, Param, Req, Get, Controller, Delete, Post, Put, Request, UseGuards, ParseIntPipe} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto/login-user.dto';
import { UpdateProfileDto } from './dto/updateProfileDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.userService.login(loginUserDto)
    }

    @Post('refresh-token') 
    async refreshToken(@Body() body: {refresh_token: string}) {
        return this.userService.refreshToken(body.refresh_token)
    }

    @Post('logout')
    async logout(@Body() body: {userId: number}) {
        return this.userService.logout(body.userId)
    }

    @Put('profile')
    async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Request() req) {
        const userId = req.user.id;
        return this.userService.updateProfile(userId, updateProfileDto)
    }

    @Put('password')
    @UseGuards(AuthGuard)
    async changePassword(
        @Body('oldPassword') oldPassword: string,
        @Body('newPassword') newPassword: string,
        @Request() req
    ) {
        const userId = req.user.id
        await this.userService.changePassword(userId, oldPassword, newPassword)
    }

    @UseGuards(AuthGuard)
    @Delete('delete-hard')
    async hardDelete(@Req() req) {
        const userId = req.user.id
        return this.userService.hardDelete(userId)
    }

    @UseGuards(AuthGuard)
    @Get('active')
    async findAllActiveUsers() {
        return this.userService.findAllActiveUsers()
    }

    @UseGuards(AuthGuard)
    @Get(':id/active')
    async findOneActiveUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOneActiveUser(id);
    }

    @Post('upload-profile-image')
    @UseGuards(AuthGuard) 
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfileImage (
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
     ) : Promise<User>  {
        const userId = req.user.id
        return this.userService.updateProfileWithImage(userId, file)
    }
}
