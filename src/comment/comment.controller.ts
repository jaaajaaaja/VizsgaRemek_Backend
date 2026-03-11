import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { SkipThrottle } from '@nestjs/throttler';
import {
  ApiBadRequestResponse, ApiCookieAuth, ApiCreatedResponse, ApiForbiddenResponse,
  ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { AddComment, AdminApprovesComment, AdminGetAllComments, DeleteComment, GetCommentById, GetCommentByPlace, GetCommentByUser, UpdateComment } from 'src/decorators/comment.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) { }

  /*
    ----------------------------------------------------------------------------------------------------------
    GET all comments
    ----------------------------------------------------------------------------------------------------------
  */

  @AdminGetAllComments()
  @Get("/all")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @SkipThrottle({ postput: true, place: true, login: true })
  getAll() {
    return this.commentService.getAll()
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    GET comment by userID
    ----------------------------------------------------------------------------------------------------------
  */

  @GetCommentById()
  @Get(':id')
  @SkipThrottle({ postput: true, place: true, login: true })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findOne(id)
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    GET comment by userID
    ----------------------------------------------------------------------------------------------------------
  */

  @GetCommentByUser()
  @Get('/findAllByUser/:userID')
  @SkipThrottle({ postput: true, place: true, login: true })
  async getAllByUser(@Param('userID', ParseIntPipe) userID: number) {
    return this.commentService.findAllByUser(userID)
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    GET comment by placeID
    ----------------------------------------------------------------------------------------------------------
  */

  @GetCommentByPlace()
  @Get('/findAllByPlace/:placeID')
  @SkipThrottle({ postput: true, place: true, login: true })
  async findAllByPlace(@Param('placeID', ParseIntPipe) placeID: number) {
    return this.commentService.findAllByPlace(placeID)
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    POST comment
    ----------------------------------------------------------------------------------------------------------
  */

  @AddComment()
  @Post()
  @UseGuards(AuthGuard)
  @SkipThrottle({ basic: true, place: true, login: true })
  async add(@Body() body: CreateCommentDto, @Req() request: Request) {
    return this.commentService.add(body, request["user"].sub)
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    DELETE comment by id
    ----------------------------------------------------------------------------------------------------------
  */

  @DeleteComment()
  @Delete(':id')
  @UseGuards(AuthGuard)
  @SkipThrottle({ postput: true, place: true, login: true })
  async delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    return this.commentService.remove(id, request["user"])
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    PUT comment by id
    ----------------------------------------------------------------------------------------------------------
  */

  @UpdateComment()
  @Put(':id')
  @UseGuards(AuthGuard)
  @SkipThrottle({ basic: true, place: true, login: true })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateCommentDto, @Req() request: Request) {
    return this.commentService.update(id, body, request["user"].sub)
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    PUT approves a comment
    ----------------------------------------------------------------------------------------------------------
  */

  @AdminApprovesComment()
  @Put(":id/approved")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @SkipThrottle({ basic: true, place: true, login: true })
  async approveByAdmin(@Param("id", ParseIntPipe) id: number) {
    return this.commentService.approveByAdmin(id)
  }
}
