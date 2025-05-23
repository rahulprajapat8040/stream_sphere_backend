import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "src/common/dtos/signup.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto)
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        console.log(loginDto)
        return this.authService.login(loginDto)
    }

}