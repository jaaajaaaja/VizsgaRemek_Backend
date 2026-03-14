import {
    Body, Controller, Delete, Get, Param, Post, UseInterceptors, UploadedFiles, ParseIntPipe,
    UseGuards, Req, BadRequestException, UnsupportedMediaTypeException, ConflictException, Put,
    HttpStatus
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PhotoService } from './photo.service';
import { extname } from 'path';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { Roles } from '../auth/roles.decorator';
import { AddPhotos, AdminApprovesPhoto, AdminGetAllPhoto, DeletePhotoById, GetAllPhotoByPlace, GetAllPhotoByUser, GetPhotoById } from 'src/decorators/photo.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import type { AuthenticatedRequest } from 'src/types/user-types';

@Controller('photo')
export class PhotoController {
    constructor(private photoService: PhotoService) { }

    /*
    ----------------------------------------------------------------------------------------------------------
    GET all photo
    ----------------------------------------------------------------------------------------------------------
    */

    @AdminGetAllPhoto()
    @Get("/all")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("admin")
    @SkipThrottle({ postput: true, place: true, login: true })
    getAll() {
        return this.photoService.getAll()
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    GET photo by id
    ----------------------------------------------------------------------------------------------------------
    */

    @GetPhotoById()
    @Get(':id')
    @SkipThrottle({ postput: true, place: true, login: true })
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return this.photoService.getOne(id)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    GET all photos by userID
    ----------------------------------------------------------------------------------------------------------
    */

    @GetAllPhotoByUser()
    @Get('/getAllByUser/:userID')
    @SkipThrottle({ postput: true, place: true, login: true })
    async getAllByUser(@Param('userID', ParseIntPipe) userID: number) {
        return this.photoService.getAllByUser(userID)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    GET all photos by placeID
    ----------------------------------------------------------------------------------------------------------
    */

    @GetAllPhotoByPlace()
    @Get('/getAllByPlace/:placeID')
    @SkipThrottle({ postput: true, place: true, login: true })
    async getAllByPlace(@Param('placeID', ParseIntPipe) placeID: number) {
        return this.photoService.getAllByPlace(placeID)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    DELETE photo by id
    ----------------------------------------------------------------------------------------------------------
    */

    @DeletePhotoById()
    @Delete(':id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ postput: true, place: true, login: true })
    async remove(@Param('id', ParseIntPipe) id: number, @Req() request: AuthenticatedRequest) {
        return this.photoService.remove(id, request.user.sub)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    POST 1-3 photos
    ----------------------------------------------------------------------------------------------------------
    */

    @AddPhotos()
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
            const fileType = file.mimetype

            if (!body.placeID) {
                return callback(new BadRequestException("userID and placeID are required!"), false)
            }

            if (!fileType || !fileType.startsWith("image/")) {
                return callback(new UnsupportedMediaTypeException("Not allowed file type!"), false)
            }

            callback(null, true)
        }
    }))
    async uploadFile(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: CreatePhotoDto,
        @Req() request: AuthenticatedRequest
    ) {
        if (!files || files.length === 0) {
            throw new ConflictException("No files were uploaded!")
        }

        return this.photoService.add(files, Number(body.placeID), request.user.sub)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    POST approves image
    ----------------------------------------------------------------------------------------------------------
    */

    @AdminApprovesPhoto()
    @Put(':id/approved')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("admin")
    @SkipThrottle({ basic: true, place: true, login: true })
    async update(@Param('id', ParseIntPipe) id: number) {
        return this.photoService.update(id)
    }
}
