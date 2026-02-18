import { Body, Controller, Delete, Get, Param, Post, UseInterceptors, UploadedFiles, ParseIntPipe, UseGuards, Req, BadRequestException, UnsupportedMediaTypeException, ConflictException, Put } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PhotoService } from './photo.service';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiBadRequestResponse, ApiConsumes, ApiCreatedResponse, ApiUnauthorizedResponse, ApiCookieAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('photo')
export class PhotoController {
    constructor(private photoService: PhotoService) { }

    /*
    ----------------------------------------------------------------------------------------------------------
    GET all photo
    ----------------------------------------------------------------------------------------------------------
    */

    @Get()
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

    @ApiOperation({ summary: "Visszaad egy képet id alapján" })
    @ApiParam({ name: "id", description: "photo id" })
    @ApiOkResponse({
        description: "Sikeresen visszaad egy képet",
        schema: {
            type: "object",
            properties: {
                id: { type: "number", example: 1 },
                location: { type: "string", example: "uploads/example.jpg" },
                type: { type: "string", example: "image/jpg" },
                user: { type: "string", example: "user name" },
                place: { type: "string", example: "place name" }
            }
        }
    })
    @ApiForbiddenResponse({
        description: "A kép elfogadásra vár",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "This image is waiting for approval!" }
            }
        }
    })
    @ApiNotFoundResponse({
        description: "A kép nem található",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Image not found!" }
            }
        }
    })
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

    @ApiOperation({ summary: "Visszaadja a felhasználő összes feltöltött és elfogadott képét" })
    @ApiParam({ name: "userID", description: "user id" })
    @ApiOkResponse({
        description: "Sikeresen visszaadja a képeket",
        schema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    location: { type: "string", example: "uploads/example.jpg" },
                    type: { type: "string", example: "image/jpg" },
                    user: { type: "string", example: "user name" },
                    place: { type: "string", example: "place name" }
                }
            }
        }
    })
    @ApiNotFoundResponse({
        description: "A felhasználó nem töltött fel képet",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "User did not upload any images!" }
            }
        }
    })
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

    @ApiOperation({ summary: "Visszaadja a helyhez feltöltött összes elfogadott képét" })
    @ApiParam({ name: "placeID", description: "place id" })
    @ApiOkResponse({
        description: "Sikeresen visszaadja a képeket",
        schema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    location: { type: "string", example: "uploads/example.jpg" },
                    type: { type: "string", example: "image/jpg" },
                    user: { type: "string", example: "user name" },
                    place: { type: "string", example: "place name" }
                }
            }
        }
    })
    @ApiNotFoundResponse({
        description: "A helyhez még nincs feltöltött képet",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Place does not have any images!" }
            }
        }
    })
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

    @ApiOperation({ summary: "Töröl egy képet id alapján" })
    @ApiCookieAuth()
    @ApiParam({ name: "id", description: "photo id" })
    @ApiOkResponse({
        description: "Sikeresen töröl egy képet",
        schema: {
            type: "object",
            properties: {
                id: { type: "number", example: 1 },
                location: { type: "string", example: "uploads/example.jpg" },
                type: { type: "string", example: "image/jpg" },
                user: { type: "string", example: "user name" },
                place: { type: "string", example: "place name" }
            }
        }
    })
    @ApiForbiddenResponse({
        description: "A felhasználó csak a saját képeit törölheti",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "You can only delete your own photos!" }
            }
        }
    })
    @ApiNotFoundResponse({
        description: "A törölni kívánt kép nem található",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Image not found!" }
            }
        }
    })
    @Delete(':id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ postput: true, place: true, login: true })
    async remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
        return this.photoService.remove(id, request["user"].sub)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    POST 1-3 photos
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "Feltölt 1-3 képet egy helyhez" })
    @ApiCookieAuth()
    @ApiConsumes('multipart/form-data')
    @ApiCreatedResponse({
        description: "Sikeresen feltöltötte a képeket",
        schema: {
            type: "number",
            example: 201
        }
    })
    @ApiBadRequestResponse({
        description: "Nem megfelelő formátum vagy hiányzó paraméterek",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "userID and placeID are required!" }
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: "Nincs hitelesítés vagy érvénytelen token",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Unauthorized" }
            }
        }
    })
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

            if (!body.userID || !body.placeID) {
                return callback(new BadRequestException("userID and placeID are required!"), false)
            }

            if (!fileType || !fileType.startsWith("image/")) {
                return callback(new UnsupportedMediaTypeException("Not allowed file type!"), false)
            }

            callback(null, true)
        }
    }))
    async uploadFile(@UploadedFiles() files: Express.Multer.File[], @Body() body: CreatePhotoDto, @Req() request: Request) {
        if (!files || files.length === 0) {
            throw new ConflictException("No files were uploaded!")
        }

        for (const file of files) {
            await this.photoService.add(file, body.userID, body.placeID, request["user"].sub)
        }

        return 201
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    POST approves or denys image visibility
    ----------------------------------------------------------------------------------------------------------
    */

    @Put(':id/approved')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("admin")
    @SkipThrottle({ basic: true, place: true, login: true })
    async update(@Param('id', ParseIntPipe) id: number) {
        return this.photoService.update(id)
    }
}
