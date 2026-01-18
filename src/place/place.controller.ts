import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('place')
export class PlaceController {
    constructor(private placeService:PlaceService) {}

    @Get()
    async getAll() {
        return this.placeService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id:number) {
        return this.placeService.getOne(id)
    }

    @Post()
    @UseGuards(AuthGuard)
    async add(@Body() body:CreatePlaceDto) {
        return this.placeService.add(body)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async remove(@Param('id', ParseIntPipe) id:number) {
        return this.placeService.remove(id)
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(@Param('id', ParseIntPipe) id:number, @Body() body:UpdatePlaceDto) {
        return this.placeService.update(id, body)
    }
}
