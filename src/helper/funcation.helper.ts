import { BadRequestException } from "@nestjs/common";


export const generatePagination = (data: any, page: number, limit: number) => {
    return {
        data: data.rows,
        pageInfo: {
            total: data.count,
            currentpage: page,
            totalPage: Math.ceil(data.count / limit)
        }
    }
}

export const repsonseSender = (message: string, status: number, success: boolean, data: any) => {
    return { message, status, success, data }
}

export const dataFound = (data: any, error: string) => {
    if (data) {
        throw new BadRequestException(error)
    }
}

// export const tokenGenrator = (data: any) => {
//     const accessToken = jwt.sign(data, process.env.SCRETE, { expiresIn: '30d' })
//     return accessToken;
// }

export const otpGenrator = (size: number) => {
    const value = Math.pow(10, size - 1)
    return Math.floor(value + (Math.random() * (9 * value)))
}