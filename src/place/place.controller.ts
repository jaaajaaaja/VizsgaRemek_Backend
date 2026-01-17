import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

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
    async add(@Body() body:CreatePlaceDto) {
        return this.placeService.add(body)
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id:number) {
        return this.placeService.remove(id)
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id:number, @Body() body:UpdatePlaceDto) {
        return this.placeService.update(id, body)
    }
}
