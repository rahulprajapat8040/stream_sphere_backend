import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { LoginDto, SignupDto } from "src/common/dtos/signup.dto";
import { ResponseInterface } from "src/common/ResponseInterface";
import { dataFound, otpGenrator, repsonseSender } from "src/helper/funcation.helper";
import * as bcrypt from 'bcryptjs'
import STRINGCONST from "src/common/stringConst";
import { response } from "express";
import { JwtService } from "@nestjs/jwt";
import { DeviceInfo, User } from "src/models";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(DeviceInfo) private readonly deviceModel: typeof DeviceInfo,
        private jwtService: JwtService
    ) { }

    async signup(signupDto: SignupDto): Promise<ResponseInterface> {
        try {
            const { name, email, password, deviceId, deviceToken, otp } = signupDto;
            if (!otp || otp == null) {
                const existingUser = await this.userModel.findOne({ where: { email } });
                const device = existingUser && await this.deviceModel.findOne({ where: { userId: existingUser?.id } })
                dataFound((existingUser && device?.otpStatus), "exist");
                await existingUser?.destroy({ force: true })
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await this.userModel.create({ ...signupDto, password: hashedPassword });
                const verificationCode = otpGenrator(4);
                await this.deviceModel.create({
                    deviceId,
                    deviceToken,
                    userId: newUser.id,
                    otp: verificationCode,
                });

                (newUser as any).dataValues.otp = verificationCode;
                return repsonseSender("OTP sent", HttpStatus.CREATED, true, newUser);
            }
            const device = await this.deviceModel.findOne({ where: { deviceId, deviceToken } });
            if (!device || otp != device.otp) {
                if (device?.userId) {
                    await this.userModel.destroy({ where: { id: device.userId } });
                }
                await this.deviceModel.destroy({ where: { deviceId, deviceToken } });
                throw new BadRequestException("Invalid OTP");
            }
            const user = await this.userModel.findOne({ where: { id: device.userId } });
            const token = await this.jwtService.signAsync({ userId: user?.id, userName: user?.name, userEmail: user?.email });
            await device.update({ otpStatus: true, accessToken: token, otp: 0 });
            (user as any).dataValues.accessToken = token;

            return repsonseSender(STRINGCONST.DATA_ADDED, HttpStatus.CREATED, true, user);
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    async login(loginDto: LoginDto): Promise<ResponseInterface> {
        try {
            const { email, password, deviceId, deviceToken } = loginDto
            console.log(loginDto)
            const user = await this.userModel.findOne({ where: { email: email } })
            if (!user) {
                throw new BadRequestException("User not found")
            }
            const compare = await bcrypt.compare(password, user.password)
            if (!compare) {
                throw new BadRequestException("invalid password")
            }
            const token = await this.jwtService.signAsync({ userId: user?.id, email: user?.email, userName: user.name })
            await this.deviceModel.destroy({ where: { deviceId, userId: user?.id }, force: true })
            await this.deviceModel.create({ deviceToken, deviceId, userId: user?.id, accessToken: token });
            (user as any).dataValues.accessToken = token
            return repsonseSender(STRINGCONST.USER_LOGIN, HttpStatus.OK, true, user)
        } catch (error) {
            console.log(error)
            throw new BadRequestException(error.message)
        }
    }
}   