import { Body, Controller, Delete, Get, Param, Post, UseInterceptors, UploadedFiles, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PhotoService } from './photo.service';
import { extname } from 'path';
import { Photo } from 'generated/prisma/client';
import { NotFoundError } from 'rxjs';
import { response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('photo')
export class PhotoController {
    constructor(private photoService: PhotoService) { }

    @Get()
    async getAll() {
        return this.photoService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id:number) {
        const photo = await this.photoService.getOne(id)

        return photo
    }

    @Get('/getAllByUser/:userID')
    async getAllByUser(@Param('userID', ParseIntPipe) userID:number) {
        return this.photoService.getAllByUser(userID)

        // http://localhost:3000/photo/getAllByUser/1
    }

    @Get('/getAllByPlace/:placeID')
    async getAllByPlace(@Param('placeID', ParseIntPipe) placeID:number) {
        return this.photoService.getAllByPlace(placeID)

        // http://localhost:3000/photo/getAllByPlace/1
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async remove(@Param('id', ParseIntPipe) id:number) {
        return this.photoService.remove(id)
    }

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FilesInterceptor('file', 3, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const randomName = Date.now() + extname(file.originalname);
                callback(null, randomName);
            }
        }),
        limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
        fileFilter: (req, file, callback) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

            if (!allowedTypes.includes(file.mimetype)) {
                return callback(new Error('Csak képet lehet feltölteni!'), false)
            }

            callback(null, true);
        }
    }))
    async uploadFile(@UploadedFiles() files: Express.Multer.File[], @Body() body: { userID: string; placeID: string }) {
        const userID = Number(body.userID)
        const placeID = Number(body.placeID)

        const createdPhotos:Photo[] = []

        for (const file of files) {
            const newPhoto = await this.photoService.add(file, userID, placeID)
            createdPhotos.push(newPhoto)
        }

        return {
            message: 'File uploaded successfully',
            images: createdPhotos
        }
    }
}
