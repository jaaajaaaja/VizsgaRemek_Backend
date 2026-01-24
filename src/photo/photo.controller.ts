import { Body, Controller, Delete, Get, Param, Post, UseInterceptors, UploadedFiles, ParseIntPipe, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PhotoService } from './photo.service';
import { extname } from 'path';
import { Photo } from 'generated/prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('photo')
export class PhotoController {
    constructor(private photoService: PhotoService) { }

    @Get()
    @SkipThrottle({ postput: true, place: true, login: true })
    async getAll() {
        return this.photoService.getAll()
    }

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

    @Post()
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    @UseInterceptors(FilesInterceptor('file', 3, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                //const randomName = Date.now() + extname(file.originalname);
                const randomName = `${Date.now()}-${Math.floor(Math.random() * 10000)}` + extname(file.originalname)
                callback(null, randomName)
            }
        }),
        limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new BadRequestException('Only image files are allowed!'), false);
            }
            callback(null, true);
        }
    }))
    async uploadFile(@UploadedFiles() files: Express.Multer.File[], @Body() body: { placeID: number }, @Req() request: Request) {
        const createdPhotos: Photo[] = []

        for (const file of files) {
            const newPhoto = await this.photoService.add(file, body.placeID, request["user"].sub)
            createdPhotos.push(newPhoto)
        }

        return {
            message: 'File uploaded successfully',
            images: createdPhotos
        }
    }
}
