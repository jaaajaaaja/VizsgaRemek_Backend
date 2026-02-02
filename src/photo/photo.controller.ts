import { Body, Controller, Delete, Get, Param, Post, UseInterceptors, UploadedFiles, ParseIntPipe, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PhotoService } from './photo.service';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { fileTypeFromBuffer } from 'file-type';

@Controller('photo')
export class PhotoController {
    constructor(private photoService: PhotoService) { }

    @Get(':id')
    @SkipThrottle({ postput: true, place: true, login: true })
    async getOne(@Param('id', ParseIntPipe) id: number) {
        const photo = await this.photoService.getOne(id)

        return photo
    }

    @Get('/getAllByUser/:userID')
    @SkipThrottle({ postput: true, place: true, login: true })
    async getAllByUser(@Param('userID', ParseIntPipe) userID: number) {
        return this.photoService.getAllByUser(userID)
    }

    @Get('/getAllByPlace/:placeID')
    @SkipThrottle({ postput: true, place: true, login: true })
    async getAllByPlace(@Param('placeID', ParseIntPipe) placeID: number) {
        return this.photoService.getAllByPlace(placeID)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ postput: true, place: true, login: true })
    async remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
        return this.photoService.remove(id, request["user"].sub)
    }

    @Post('/upload')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    @Throttle({ postput: { ttl: 60000, limit: 5 } })
    @UseInterceptors(FilesInterceptor("file", 3, {
        storage: diskStorage({
            destination: "./uploads",
            filename: (req, file, callback) => {
                const randomName = `${Date.now()}-${Math.floor(Math.random() * 10000)}` + extname(file.originalname)
                callback(null, randomName)
            }
        }),
        limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
        fileFilter: async (req, file, callback) => {
            const body = req.body
            if (!body.userID || !body.placeID) {
                return callback(new BadRequestException("userID and placeID are required!"), false)
            }

            const fileType = await fileTypeFromBuffer(file.buffer)
            if (!fileType || !fileType.mime.startsWith("image")) {
                return callback(new BadRequestException("Only allowed file types are accepted!"), false)
            }

            callback(null, true)
        }
    }))
    async uploadFile(@UploadedFiles() files: Express.Multer.File[], @Body() body: CreatePhotoDto, @Req() request: Request) {
        if (!files || files.length === 0) {
            throw new BadRequestException("No files were uploaded!")
        }

        for (const file of files) {
            await this.photoService.add(file, body.userID, body.placeID, request["user"].sub)
        }

        return 201
    }
}
