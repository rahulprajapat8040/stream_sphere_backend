import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { VidService } from "./vid.service";
import { Request } from "express";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/models";
import { CommentDto } from "src/common/dtos/vid.dto";

@Controller('videos')
export class VidController {
    constructor(private readonly vidService: VidService) { }
    @Post('upload-video')
    @UseGuards(AuthGuard)
    async uploadVideo(@Req() req: Request) {
        return this.vidService.uploadVideo(req)
    }

    @Post('like-video')
    @UseGuards(AuthGuard)
    async addLike(@Req() req: Request, @Body() { videoId }) {
        return this.vidService.likeVideo(req.user as User, videoId)
    }

    @Get('get-all-videos')
    async getAllVideos(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.vidService.getAllVideos({ page, limit })
    }

    @Get('get-video-by-id')
    async getVideoById(
        @Query('videoId') videoId: string,
    ) {
        return this.vidService.getVideoById(videoId)
    }

    @Get('get-like')
    async getIsLiked(@Req() req: Request, @Query('videoId') videoId: string) {
        return this.vidService.getLike(req.user as User, videoId)
    }

    @Post('add-dislike')
    async addDisLike(@Req() req: Request, @Body() { videoId }) {
        return this.vidService.addDisLike(req.user as User, videoId)
    }

    @Get('get-dislike')
    async getIsDisLike(@Req() req: Request, @Query('videoId') videoId: string) {
        return this.vidService.getDisLike(req.user as User, videoId)
    }

    @Post('add-comment')
    async addComment(@Req() req: Request, @Body() commentDto: CommentDto) {
        return this.vidService.addComment(req.user as User, commentDto)
    }

    @Get('get-comments')
    async getComments(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('videoId') videoId?: string,
    ) {
        return this.vidService.getAllComment({ page, limit, videoId })
    }

    @Post('start-following')
    async newFollwing(@Req() req: Request, @Body('followedToId') followedToId: string) {
        console.log('fo', followedToId)
        return this.vidService.startFollowing(req.user as User, followedToId)
    }

    @Post('un-follow')
    async unFollow() {

    }

    @Get('get-following')
    async getFollowings(
        @Req() req: Request,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('videoId') videoId?: string,) {
        return this.vidService.getFollowings(req.user as User, { page, limit, videoId })
    }

    @Get('get-followed-detail')
    async getFollowingDetail(@Req() req: Request, @Query('followedToId') followedToId: string) {
        return this.vidService.getFollowingDetail(req.user as User, followedToId)
    }

}