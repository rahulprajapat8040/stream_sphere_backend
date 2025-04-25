import { Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request } from "express";
import { User } from "src/models";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get('user-data')
    @UseGuards(AuthGuard)
    async getUserData(@Req() req: Request, @Query('userId') userId: string) {
        return this.userService.getUser(req.user as User, userId)
    }

}