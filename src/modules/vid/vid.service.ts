import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Channel, CommentReply, Comments, DisLikes, Likes, User, Videos } from "src/models";
import { FileService } from "../files/file.service";
import { generatePagination, repsonseSender } from "src/helper/funcation.helper";
import STRINGCONST from "src/common/stringConst";
import { ResponseInterface } from "src/common/ResponseInterface";
import { CommentDto } from "src/common/dtos/vid.dto";

@Injectable()
export class VidService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Videos) private readonly videoModel: typeof Videos,
        @InjectModel(Likes) private readonly likeModel: typeof Likes,
        @InjectModel(DisLikes) private readonly disLikeModel: typeof DisLikes,
        @InjectModel(Comments) private readonly commentsModel: typeof Comments,
        @InjectModel(CommentReply) private readonly commentsReplyModel: typeof CommentReply,
        @InjectModel(Channel) private readonly channelModel: typeof Channel,
        private readonly fileService: FileService
    ) { }

    async uploadVideo(req: any) {
        const { file, body } = await this.fileService.uploadFile(req, 'videos')
        try {
            const fileMap: Record<string, string | null> = { videoUrl: null, thumbnail: null };
            file.forEach(file => {
                if (file.fieldname === "videoUrl") {
                    fileMap.videoUrl = file.path;
                } else if (file.fieldname === "thumbnail") {
                    fileMap.thumbnail = file.path;
                }
            });
            const video = await this.videoModel.create({ ...body, uploadedById: req.user.id, videoUrl: fileMap.videoUrl, thumbnail: fileMap.thumbnail })
            return video
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async likeVideo(user: User, videoId: string) {
        const existLike = await this.likeModel.findOne({ where: { videoId, likedById: user.id } })
        if (existLike) {
            await existLike.destroy({ force: true })
            return repsonseSender(STRINGCONST.DATA_ADDED, HttpStatus.OK, true, existLike)
        }
        const addLike = await this.likeModel.create({ videoId: videoId, likedById: user.id })
        return repsonseSender(STRINGCONST.DATA_ADDED, HttpStatus.OK, true, addLike)
    }

    async getAllVideos(queryParams): Promise<ResponseInterface> {
        try {
            const { page = 1, limit = 10 } = queryParams
            const offset = Number((page - 1) * limit);
            const videos = await this.videoModel.findAndCountAll({ limit, offset });
            const response = generatePagination(videos, page, limit)
            return repsonseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, response)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async getVideoById(videoId: string): Promise<ResponseInterface> {
        try {
            const video = await this.videoModel.findByPk(videoId)
            const likesCount = await this.likeModel.count({ where: { videoId } });
            const dislikesCount = await this.disLikeModel.count({ where: { videoId } });
            (video as any).dataValues.likes = likesCount;
            (video as any).dataValues.disLikes = dislikesCount
            return repsonseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, video)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async getLike(user: User, videoId: string): Promise<ResponseInterface> {
        try {
            const isLiked = await this.likeModel.findOne({ where: { likedById: user.id, videoId: videoId } })
            return repsonseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, isLiked ? true : false)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async addDisLike(user: User, videoId: string,): Promise<ResponseInterface> {
        try {
            const existDisLike = await this.disLikeModel.findOne({ where: { videoId, disLikeById: user.id } })
            if (existDisLike) {
                await existDisLike.destroy({ force: true })
                return repsonseSender(STRINGCONST.DATA_ADDED, HttpStatus.OK, true, existDisLike)
            }
            const disLike = await this.disLikeModel.create({ videoId: videoId, disLikeById: user.id })
            return repsonseSender(STRINGCONST.DATA_ADDED, HttpStatus.OK, true, disLike)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async getDisLike(user: User, videoId: string,): Promise<ResponseInterface> {
        try {
            const disLike = await this.disLikeModel.findOne({ where: { videoId, disLikeById: user.id } })
            return repsonseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, disLike ? true : false)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async addComment(user: User, commentDto: CommentDto): Promise<ResponseInterface> {
        try {
            const comment = await this.commentsModel.create({ ...commentDto, commentedById: user.id, })
            return repsonseSender(STRINGCONST.DATA_ADDED, HttpStatus.OK, true, comment)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async getAllComment(queryParams: any): Promise<ResponseInterface> {
        try {
            const { page = 1, limit = 10, videoId } = queryParams
            const offset = Number((page - 1) * limit);
            const comments = await this.commentsModel.findAndCountAll({
                where: { videoId: videoId },
                include: [{ model: User }],
                limit, offset,
            })
            const response = generatePagination(comments, page, limit)
            return repsonseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, response)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async startFollowing(user: User, followTo: string): Promise<ResponseInterface> {
        try {
            const follow = await this.channelModel.create({
                followById: user.id,
                followedToId: followTo
            })
            return repsonseSender(STRINGCONST.DATA_ADDED, HttpStatus.OK, true, follow)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async unFollow(user: User, unFollowTo: string): Promise<ResponseInterface> {
        try {
            const unFollow = await this.channelModel.destroy({
                where: {
                    followById: user.id,
                    followedToId: unFollowTo
                }
            })
            return repsonseSender(STRINGCONST.DATA_DELETED, HttpStatus.OK, true, unFollow)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async getFollowers(user: User) {
        try {
            const followers = await this.channelModel.findAndCountAll({
                where: { followById: user.id }
            })
            return repsonseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, followers)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

}