import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('place')
export class PlaceController {
    constructor(private placeService: PlaceService) { }

    @Get()
    @SkipThrottle({postput: true, place: true, login: true})
    async getAll() {
        return this.placeService.getAll()
    }

    @Get(':id')
    @SkipThrottle({postput: true, place: true, login: true})
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return this.placeService.getOne(id)
    }

    @Post()
    @UseGuards(AuthGuard)
    @SkipThrottle({basic: true, place: true, login: true})
    @Throttle({ place: { ttl: 60000, limit: 10 } })
    async add(@Body() body: CreatePlaceDto) {
        return this.placeService.add(body)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @SkipThrottle({postput: true, place: true, login: true})
    @Throttle({ place: { ttl: 60000, limit: 3 } })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.placeService.remove(id)
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @SkipThrottle({basic: true, place: true, login: true})
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePlaceDto) {
        return this.placeService.update(id, body)
    }
}
