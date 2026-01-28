import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreatePlaceCategoryDto } from './dto/create-place-category.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('place')
export class PlaceController {
    constructor(private placeService: PlaceService) { }

    @Get(':id')
    @SkipThrottle({ postput: true, place: true, login: true })
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return this.placeService.getOne(id)
    }

    @Get('/getByGooglePlaceId/:googleplaceID')
    @SkipThrottle({ postput: true, place: true, login: true })
    async getOneByGooglePlaceId(@Param('googleplaceID') googleplaceID: string) {
        return this.placeService.getOneByGoogleplaceID(googleplaceID)
    }

    @Post()
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    @Throttle({ place: { ttl: 60000, limit: 10 } })
    async add(@Body() body: CreatePlaceDto) {
        return this.placeService.add(body)
    }

    @Post(':placeID/category')
    @SkipThrottle({ basic: true, place: true, login: true })
    async addPlaceCategory(@Param('placeID', ParseIntPipe) placeID: number, @Body() body: CreatePlaceCategoryDto) {
        return this.placeService.addPlaceCategory(body, placeID)
    }

    @Post(':id/news')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async addNews(@Req() request: Request, @Body() body: CreateNewsDto) {
        return this.placeService.addNews(body, request["user"].sub)
    }

    @Put('/news/:id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async updateNews(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request,
        @Body() body: UpdateNewsDto
    ) {
        return this.placeService.updateNews(id, body, request["user"].sub)
    }
}
