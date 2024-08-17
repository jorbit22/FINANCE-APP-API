import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    firstName?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    lastName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;
}