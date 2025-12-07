import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, Response, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { PhotoService } from './photo.service';
import { extname } from 'path';
import { Photo } from 'generated/prisma/client';

@Controller('photo')
export class PhotoController {
    constructor(private photoService: PhotoService) { }

    @Get()
    async getAll() {
        return this.photoService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.photoService.getOne(Number(id))
    }

    @Get('/getAllByUser/:userID')
    async getAllByUser(@Param('userID') userID: string) {
        return this.photoService.getAllByUser(Number(userID))

        // http://localhost:3000/photo/getAllByUser/1
    }

    @Get('/getAllByPlace/:placeID')
    async getAllByPlace(@Param('placeID') placeID: string) {
        return this.photoService.getAllByPlace(Number(placeID))

        // http://localhost:3000/photo/getAllByPlace/1
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.photoService.remove(Number(id))
    }

    @Post()
    @UseInterceptors(FilesInterceptor('file', 3, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const randomName = Date.now() + extname(file.originalname);
                callback(null, randomName);
            }
        }),
        limits: { fileSize: 2 * 1024 * 1024 },
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
            createdPhotos.push(newPhoto);
        }

        return {
            message: 'File uploaded successfully',
            images: createdPhotos
        }
    }
}
