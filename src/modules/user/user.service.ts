import { ConsoleLogger, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import STRINGCONST from "src/common/stringConst";
import { repsonseSender } from "src/helper/funcation.helper";
import { DisLikes, Likes, User, Videos } from "src/models";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Likes) private readonly likeModel: typeof Likes,
        @InjectModel(DisLikes) private readonly disLikeModel: typeof DisLikes,
        @InjectModel(Videos) private readonly videoModel: typeof Videos
    ) { }

    async getUser(user: User | null, userId: string) {
        try {
            let findUser: string
            userId ? findUser = userId : findUser = user?.id as string
            const userData = await this.userModel.findByPk(findUser)
            const userVideos = await this.videoModel.findAndCountAll({
                where: { uploadedById: userData?.id },
                limit: 4,
                attributes: { exclude: ["description"] }
            })
            const likedVideos = await this.likeModel.findAndCountAll({
                where: { likedById: userData?.id },
                limit: 6,
                include: [{ model: this.videoModel, attributes: ["id", "videoUrl", "thumbnail", "title"] }]
            });
            (userData as any).dataValues.likedVideos = likedVideos;
            (userData as any).dataValues.userVideos = userVideos;
            return repsonseSender(STRINGCONST.DATA_FETCHED, HttpStatus.OK, true, userData)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}