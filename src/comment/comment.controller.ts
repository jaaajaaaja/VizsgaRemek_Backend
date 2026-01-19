import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  async getAll() {
    return this.commentService.findAll()
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id:number) {
    return this.commentService.findOne(id)
  }

  @Get('/findAllByUser/:userID')
  async getAllByUser(@Param('userID', ParseIntPipe) userID:number) {
    return this.commentService.findAllByUser(userID)
  }

  /*@Get('/findOneByUser/:userID')
    async getOneByUser(@Param('userID') userID:string) {
        return this.commentService.findOneByUser(Number(userID))
    }*/

  @Get('/findAllByPlace/:placeID')
  async findAllByPlace(@Param('placeID', ParseIntPipe) placeID:number) {
    return this.commentService.findAllByPlace(placeID)
  }

  @Post()
  @UseGuards(AuthGuard)
  async add(@Body() body: CreateCommentDto) {
    return this.commentService.add(body)
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id', ParseIntPipe) id:number, @Param('userID', ParseIntPipe) userID:number) {
    return this.commentService.remove(id, userID)
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id', ParseIntPipe) id:number, @Body() body: UpdateCommentDto) {
    return this.commentService.update(id, body)
  }

  @Get('/findAllByGooglePlace/:googlePlaceID')
  async findAllByGooglePlace(@Param('googlePlaceID') googlePlaceID: string) {
    return this.commentService.findAllByGooglePlace(googlePlaceID)
  }
}
