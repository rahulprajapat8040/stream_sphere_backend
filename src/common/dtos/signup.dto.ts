import { IsNotEmpty, IsString } from "class-validator";
import { IsEmail } from "sequelize-typescript";

export class SignupDto {
    @IsNotEmpty({ message: "DeviceId can not be empty" })
    @IsString()
    deviceId: string

    @IsNotEmpty({ message: 'Device token is required' })
    @IsString()
    deviceToken: string

    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    name: string

    @IsNotEmpty({ message: "Email is required" })
    email: string

    @IsNotEmpty({ message: "Password is required" })
    password: string

    otp: number
}

export class LoginDto {
    @IsNotEmpty({ message: "DeviceId can not be empty" })
    @IsString()
    deviceId: string

    @IsNotEmpty({ message: 'Device token is required' })
    @IsString()
    deviceToken: string

    @IsNotEmpty({ message: "Email is required" })
    email: string

    @IsNotEmpty({ message: "Password is required" })
    password: string
}