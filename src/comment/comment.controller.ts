import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBadRequestResponse, ApiCookieAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) { }

  /*
    ----------------------------------------------------------------------------------------------------------
    GET all comments
    ----------------------------------------------------------------------------------------------------------
  */

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

  @ApiOperation({ summary: "Visszaad egy kommentet id alapján" })
  @ApiParam({ name: "id", description: "comment id" })
  @ApiOkResponse({
    description: "Visszaad egy kommentet",
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        commentText: { type: "string", example: "Elég jó ez a hely!" },
        rating: { type: "number", example: 4 },
        createdAt: { type: "date", example: "2026-01-28 12:41:49.938" },
        updatedAt: { type: "date", example: "2026-02-13 12:41:49.939" },
        userID: { type: "number", example: 1 },
        placeID: { type: "number", example: 1 }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Elfogadásra váró komment",
    schema: {
      type: "object",
      properties: {
        res: { type: "string", example: "This comment is waiting for approval!" }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "Nem létezik a komment.",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Comment not found!" }
      }
    }
  })
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

  @ApiOperation({ summary: "Visszaadja egy felhasználó összes kommentejét id alapján" })
  @ApiParam({ name: "userID", description: "user id" })
  @ApiOkResponse({
    description: "Visszaadja a felhasználó összes kommentjét, ami el van fogadva",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          commentText: { type: "string", example: "Elég jó ez a hely!" },
          rating: { type: "number", example: 4 },
          createdAt: { type: "date", example: "2026-01-28 12:41:49.938" },
          updatedAt: { type: "date", example: "2026-02-13 12:41:49.939" },
          userID: { type: "number", example: 1 },
          placeID: { type: "number", example: 1 }
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "Nincs a felhasználónak kommentje",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "User did not post any comments!" }
      }
    }
  })
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

  @ApiOperation({ summary: "Visszaadja egy hely összes kommentejét id alapján" })
  @ApiParam({ name: "placeID", description: "place id" })
  @ApiOkResponse({
    description: "Visszaadja a hely összes kommentjét, ami el van fogadva",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          commentText: { type: "string", example: "Elég jó ez a hely!" },
          rating: { type: "number", example: 4 },
          createdAt: { type: "date", example: "2026-01-28 12:41:49.938" },
          updatedAt: { type: "date", example: "2026-02-13 12:41:49.939" },
          userID: { type: "number", example: 1 },
          placeID: { type: "number", example: 1 }
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "A hely nem található",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Place not found!" }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "A helyhez nem posztoltak kommentet",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Place does not have any comments!" }
      }
    }
  })
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

  @ApiOperation({ summary: "Hozzáad egy kommentet" })
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description: "Létrehozza a kommentet",
    schema: {
      type: "object",
      properties: {
        commentText: { type: "string", example: "Komment szöveg" },
        rating: { type: "number", example: 4 },
        placeID: { type: "number", example: 1 }
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Elutasítja a komment létrehozását",
    schema: {
      type: "object",
      properties: {
        commentText: { type: "string", example: null },
        rating: { type: "number", example: 4 },
        placeID: { type: "number", example: 1 }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: "Elutasítja a komment létrehozását, ha nem vagyunk bejelentkezve",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Unauthorized" }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "Nem találja a helyet amihez kommentelni szeretnénk",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Place not found!" }
      }
    }
  })
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

  @ApiOperation({ summary: "Töröl egy kommentet id alapján" })
  @ApiCookieAuth()
  @ApiParam({ name: "id", description: "comment id" })
  @ApiOkResponse({ description: "Sikeres komment törlés" })
  @ApiNotFoundResponse({
    description: "Nincs komment amit törölni lehetne",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Can not delete comment, not found!" }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "A bejelentkezett felhasználó csak a saját kommentjét törölheti",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "You can only delete your own comment!" }
      }
    }
  })
  @Delete(':id')
  @UseGuards(AuthGuard)
  @SkipThrottle({ postput: true, place: true, login: true })
  async delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    return this.commentService.remove(id, request["user"].sub, request["user"])
  }

  /*
    ----------------------------------------------------------------------------------------------------------
    PUT comment by id
    ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "Módosít egy kommentet" })
  @ApiCookieAuth()
  @ApiParam({ name: "id", description: "comment id" })
  @ApiOkResponse({
    description: "Sikeres módosítás",
    schema: {
      type: "object",
      properties: {
        commentText: { type: "string", example: "Fissített komment üzenet" },
        rating: { type: "number", example: 4 },
        placeID: { type: "number", example: 1 }
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Elutasítja a módosítást",
    schema: {
      type: "object",
      properties: {
        commentText: { type: "string", example: null },
        rating: { type: "number", example: 4 },
        placeID: { type: "number", example: 1 }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "A bejelentkezett felhasználó csak a saját kommentjeit módosíthatja",
    schema: {
      type: "object",
      properties: {
        messsage: { type: "string", example: "You can only edit your own comments!" }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "Nem található a komment amit módosítani szeretne a felhasználó",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "No comment found!" }
      }
    }
  })
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

  @Put(":id/approved")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @SkipThrottle({ basic: true, place: true, login: true })
  async approveByAdmin(@Param("id", ParseIntPipe) id: number) {
    return this.commentService.approveByAdmin(id)
  }
}
