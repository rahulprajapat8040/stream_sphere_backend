import { IsNotEmpty } from "class-validator";

export class CommentDto {
    id: string
    @IsNotEmpty()
    comment: string

    @IsNotEmpty()
    videoId: string
}