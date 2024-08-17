import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto/login-user.dto';
import { UpdateProfileDto } from './dto/updateProfileDto';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private activityLogService: ActivityLogService,
    private cloudinaryService: CloudinaryService,
    ){}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOneBy({email: createUserDto.email})
        
        if(existingUser) {
            throw new BadRequestException('userwith this email already exist')
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
        const user = this.usersRepository.create({...createUserDto, password: hashedPassword })
       const savedUser = await  this.usersRepository.save(user)
       
        await this.activityLogService.createLog({
         user: savedUser,
         action: "User registered",
         timeStamp: new Date(),
       })
       
        return savedUser
    
    
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.usersRepository.findOneBy({email: loginUserDto.email })

        if(!user || !(await bcrypt.compare(loginUserDto.password, user.password)) ) {
            throw new BadRequestException('invalid credentials')
        }
        const payload = {id: user.id, email: user.email}
    
        const accessToken = this.jwtService.sign(payload)
        const refreshToken = this.jwtService.sign(payload, {expiresIn: '7d' })
        
       
        await this.usersRepository.update(user.id, {refreshToken})
         
        await this.activityLogService.createLog({user, action: 'Uer logged in', timeStamp: new Date()} )
        return {accessToken, refreshToken}
    
    }

    async refreshToken(token: string) {
        try {
            
            const payload = this.jwtService.verify(token);
    
            
            if (!payload.id) {
                throw new BadRequestException('Invalid token payload');
            }
    
            
            const user = await this.usersRepository.findOneBy({ id: payload.id });
    
        
            if (!user || user.refreshToken !== token) {
                throw new BadRequestException('Invalid refresh token');
            }
    
        
            const newAccessToken = this.jwtService.sign({ id: user.id, email: user.email }, { expiresIn: '1h' });
    
            return { access_token: newAccessToken };
        } catch (error) {
            console.error('Refresh token error:', error.message);
            throw new BadRequestException('Invalid refresh token');
        }
    }
    

    async logout(userId: number) {
        await this.usersRepository.update(userId, {refreshToken: null})
    }

    async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
        const user = await this.usersRepository.findOneBy({id: userId})
        if(!user) {
            throw new BadRequestException('user not found')
        }

        if(updateProfileDto.password) {
            updateProfileDto.password = await bcrypt.hash(updateProfileDto.password, 10)
        }

        await this.usersRepository.update(userId, updateProfileDto)
        await this.activityLogService.createLog({user, action: 'Updated profile', timeStamp: new Date()} )
        
        return this.usersRepository.findOneBy({id: userId})
    }

    async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
        const user = await this.usersRepository.findOneBy({id: userId});
        if(!user || !(await bcrypt.compare(oldPassword, user.password))) {
            throw new BadRequestException('invalid credentials')
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await this.usersRepository.update(userId, {password: hashedPassword})
       
        await this.activityLogService.createLog({user, action: 'Changed password', timeStamp: new Date()} )
    
    }

    async updateProfileWithImage(userId: number, file: Express.Multer.File) : Promise<User> {
        const user = await this.usersRepository.findOneBy({id:userId })
        if(!user) {
            throw new BadRequestException('user not found')
        }

        const imageUrl = await this.cloudinaryService.uploadImage(file)
         user.profileImageUrl = imageUrl
         return this.usersRepository.save(user)
    }

     async deleteAccount(userId: number): Promise<void> {
        const user = await this.usersRepository.findOneBy({id: userId })
    
        if(!user) {
            throw new NotFoundException('user not found')
        }
        
        if(user.deletedAt) {
            throw new NotFoundException('user already deleted')
        }

        user.deletedAt= new Date()
        await this.usersRepository.save(user)
        await this.activityLogService.createLog({user, action: 'Deleted account', timeStamp: new Date()} ) 
    }

    async restoreAccount(userId: number) : Promise<User> {
        const user = await this.usersRepository.findOneBy({id: userId, deletedAt: Not(null)})
 
       if(!user) {
        throw new NotFoundException('Deleted user not found')
       }

       user.deletedAt = null
       return this.usersRepository.save(user)
 
    }

    async hardDelete(userId: number) : Promise<void> {
        const result = await this.usersRepository.delete(userId)

        if(result.affected === 0) {
            throw new NotFoundException("user notfound")
        }
        
    }
   

    async findAllActiveUsers(): Promise<User[]> {
        return this.usersRepository.find({
            where: {deletedAt: null}
        })
    }

    async findOneActiveUser(userId: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({id: userId, deletedAt: Not(null)})
        
        if(!user) {
            throw new BadRequestException('user not found or already deleted')
        }

        return user
    
    
    }

   
}


