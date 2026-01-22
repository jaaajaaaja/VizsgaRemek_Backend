import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) { }

  @Get()
  @SkipThrottle({ postput: true, place: true, login: true })
  async getAll() {
    return this.commentService.findAll()
  }

  @Get(':id')
  @SkipThrottle({ postput: true, place: true, login: true })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findOne(id)
  }

  @Get('/findAllByUser/:userID')
  @SkipThrottle({ postput: true, place: true, login: true })
  async getAllByUser(@Param('userID', ParseIntPipe) userID: number) {
    return this.commentService.findAllByUser(userID)
  }

  @Get('/findAllByPlace/:placeID')
  @SkipThrottle({ postput: true, place: true, login: true })
  async findAllByPlace(@Param('placeID', ParseIntPipe) placeID: number) {
    return this.commentService.findAllByPlace(placeID)
  }

  @Get('/findAllByGooglePlace/:googlePlaceID')
  @SkipThrottle({ postput: true, place: true, login: true })
  async findAllByGooglePlace(@Param('googlePlaceID') googlePlaceID: string) {
    return this.commentService.findAllByGooglePlace(googlePlaceID)
  }

  @Post()
  @UseGuards(AuthGuard)
  @SkipThrottle({basic: true, place: true, login: true})
  async add(@Body() body: CreateCommentDto, @Req() request: Request) {
    return this.commentService.add(body, request["user"].sub)
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @SkipThrottle({ postput: true, place: true, login: true })
  async delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    return this.commentService.remove(id, request["user"].sub)
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @SkipThrottle({ basic: true, place: true, login: true })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCommentDto, @Req() request: Request) {
    return this.commentService.update(id, body, request["user"].sub)
  }
}
