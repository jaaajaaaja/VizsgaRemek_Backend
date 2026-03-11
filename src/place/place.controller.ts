import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreatePlaceCategoryDto } from './dto/create-place-category.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Roles } from '../auth/roles.decorator';
import {
  AddCategory, AddNews, AddPlace, AdminApprovesNews, AdminDeletesPlace, AdminGetAllNews,
  AdminGetAllPlaces, GetAllNewsByPlace, GetPlaceByGoogleplaceID, GetPlaceById, UpdateNews
} from 'src/decorators/place.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) { }

  /*
    ----------------------------------------------------------------------------------------------------------
    PLACE
    ----------------------------------------------------------------------------------------------------------
  */

  //DELETE place admin

  @AdminDeletesPlace()
  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @SkipThrottle({ basic: true, place: true, login: true })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.placeService.remove(id)
  }

  //GET all place

  @AdminGetAllPlaces()
  @Get("/all")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @SkipThrottle({ postput: true, place: true, login: true })
  findAll() {
    return this.placeService.getAll()
  }

  //GET place by id

  @GetPlaceById()
  @Get(':id')
  @SkipThrottle({ postput: true, place: true, login: true })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.placeService.getOne(id)
  }

  //GET place by googleplaceID

  @GetPlaceByGoogleplaceID()
  @Get('/getByGooglePlaceId/:googleplaceID')
  @SkipThrottle({ postput: true, place: true, login: true })
  async getOneByGooglePlaceId(@Param('googleplaceID') googleplaceID: string) {
    return this.placeService.getOneByGoogleplaceID(googleplaceID)
  }

  //POST place

  @AddPlace()
  @Post()
  @UseGuards(AuthGuard)
  @SkipThrottle({ basic: true, place: true, login: true })
  @Throttle({ place: { ttl: 60000, limit: 10 } })
  async add(@Body() body: CreatePlaceDto) {
    return this.placeService.add(body)
  }


  /*
    ----------------------------------------------------------------------------------------------------------
    PLACE CATEGORY
    ----------------------------------------------------------------------------------------------------------
  */

  //POST place category by placeID

  @AddCategory()
  @Post(':placeID/category')
  @SkipThrottle({ basic: true, place: true, login: true })
  async addPlaceCategory(
    @Param('placeID', ParseIntPipe) placeID: number,
    @Body() body: CreatePlaceCategoryDto,
  ) {
    return this.placeService.addPlaceCategory(body, placeID)
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    NEWS
    ----------------------------------------------------------------------------------------------------------
  */

  //PUT admin approves a news

  @AdminApprovesNews()
  @Put(":newsId/approve")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @SkipThrottle({ basic: true, place: true, login: true })
  approveNews(@Param("newsId", ParseIntPipe) newsID: number) {
    return this.placeService.approveNews(newsID)
  }

  //GET all news

  @AdminGetAllNews()
  @Get("/news/all")
  @SkipThrottle({ basic: true, place: true, login: true })
  getAllNews() {
    return this.placeService.getAllNews()
  }

  //POST news by placeID

  @AddNews()
  @Post(':id/news')
  @UseGuards(AuthGuard)
  @SkipThrottle({ basic: true, place: true, login: true })
  async addNews(@Req() request: Request, @Body() body: CreateNewsDto) {
    return this.placeService.addNews(body, request['user'].sub)
  }

  //PUT news by newsID

  @UpdateNews()
  @Put('/news/:id')
  @UseGuards(AuthGuard)
  @SkipThrottle({ basic: true, place: true, login: true })
  async updateNews(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
    @Body() body: UpdateNewsDto,
  ) {
    return this.placeService.updateNews(id, body, request['user'].sub)
  }

  //GET all news by placeID

  @GetAllNewsByPlace()
  @Get(':placeID/news')
  @SkipThrottle({ postput: true, place: true, login: true })
  async getNews(@Param('placeID', ParseIntPipe) placeID: number) {
    return this.placeService.getNews(placeID)
  }
}
