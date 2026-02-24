import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { AuthGuard } from '../auth/auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { CreatePlaceCategoryDto } from './dto/create-place-category.dto';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiCookieAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('place')
export class PlaceController {
  constructor(private placeService: PlaceService) { }

  /*
  ----------------------------------------------------------------------------------------------------------
  PUT admin approves a news
  ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "ADMIN - Elfogad egy hírt" })
  @ApiCookieAuth()
  @ApiParam({ name: "id", description: "news id" })
  @ApiOkResponse({
    description: "Sikeresen elfogadja a hírt",
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        approved: { type: "boolean", example: true }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Csak admin férhet hozzá a végponthoz",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Forbidden resource!" }
      }
    }
  })
  @Put(":newsId/approve")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @SkipThrottle({ basic: true, place: true, login: true })
  approveNews(@Param("newsId", ParseIntPipe) newsID: number) {
    return this.placeService.approveNews(newsID)
  }

  /*
  ----------------------------------------------------------------------------------------------------------
  GET all news
  ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "ADMIN - Visszaadja az összes hírt" })
  @ApiCookieAuth()
  @ApiOkResponse({
    description: "Visszaadja a híreket",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          text: { type: "string", example: "Test news text." },
          placeID: { type: "number", example: 1 },
          userID: { type: "number", example: 1 }
        }
      }

    }
  })
  @ApiForbiddenResponse({
    description: "Csak admin férhet hozzá a végponthoz",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Forbidden resource!" }
      }
    }
  })
  @Get("/allNews")
  @SkipThrottle({ basic: true, place: true, login: true })
  getAllNews() {
    return this.placeService.getAllNews()
  }

  /*
  ----------------------------------------------------------------------------------------------------------
  DELETE place admin
  ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "ADMIN - Töröl egy helyet" })
  @ApiCookieAuth()
  @ApiParam({ name: "id", description: "place id" })
  @ApiOkResponse({
    description: "Töröl egy helyet",
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        text: { type: "string", example: "Test news text." },
        placeID: { type: "number", example: 1 },
        userID: { type: "number", example: 1 }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Csak admin férhet hozzá a végponthoz",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Forbidden resource!" }
      }
    }
  })
  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin")
  @SkipThrottle({ basic: true, place: true, login: true })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.placeService.remove(id)
  }

  /*
  ----------------------------------------------------------------------------------------------------------
  GET all place
  ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "ADMIN - Visszaadja az összes helyet" })
  @ApiCookieAuth()
  @ApiOkResponse({
    description: "Visszaadja az összes helyet az adatbázisban, ha van",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          googleplaceID: { type: "string", example: "PELDA123ID" },
          name: { type: "string", example: "Hely neve" },
          address: { type: "string", example: "Példa u. 123" }
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "Nincs hely felvéve az adatbázisba",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "No places in database!" }
      }
    }
  })
  @Get("/all")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @SkipThrottle({ postput: true, place: true, login: true })
  findAll() {
    return this.placeService.getAll()
  }

  /*
  ----------------------------------------------------------------------------------------------------------
  GET place by id
  ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "Visszad egy helyet id alapján" })
  @ApiParam({ name: "id", description: "place id" })
  @ApiOkResponse({
    description: "Visszad egy helyet",
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        googleplaceID: { type: "string", example: "PELDA123ID" },
        name: { type: "string", example: "Hely neve" },
        address: { type: "string", example: "Példa u. 123" }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "Nem létezik a hely amit le akarunk kérni",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Place not found!" }
      }
    }
  })
  @Get(':id')
  @SkipThrottle({ postput: true, place: true, login: true })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.placeService.getOne(id);
  }

  /*
  ----------------------------------------------------------------------------------------------------------
  GET place by googleplaceID
  ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "Visszad egy helyet google place id alapján" })
  @ApiParam({ name: "googleplaceID", description: "googleplace id" })
  @ApiOkResponse({
    description: "Visszad egy helyet",
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        googleplaceID: { type: "string", example: "PELDA123ID" },
        name: { type: "string", example: "Hely neve" },
        address: { type: "string", example: "Példa u. 123" }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "Nem létezik a hely amit le akarunk kérni",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Place not found!" }
      }
    }
  })
  @Get('/getByGooglePlaceId/:googleplaceID')
  @SkipThrottle({ postput: true, place: true, login: true })
  async getOneByGooglePlaceId(@Param('googleplaceID') googleplaceID: string) {
    return this.placeService.getOneByGoogleplaceID(googleplaceID);
  }

  /*
  ----------------------------------------------------------------------------------------------------------
  POST place 
  ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "Létrehoz egy helyet" })
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description: "Létrehozza a helyet",
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        googleplaceID: { type: "string", example: "PELDA123ID" },
        name: { type: "string", example: "Hely neve" },
        address: { type: "string", example: "Példa u. 123" }
      }
    }
  })
  @Post()
  @UseGuards(AuthGuard)
  @SkipThrottle({ basic: true, place: true, login: true })
  @Throttle({ place: { ttl: 60000, limit: 10 } })
  async add(@Body() body: CreatePlaceDto) {
    return this.placeService.add(body);
  }

  /*
  ----------------------------------------------------------------------------------------------------------
  POST place category by placeID
  ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "Létrehoz egy hely kategóriákat" })
  @ApiCookieAuth()
  @ApiParam({ name: "placeID", description: "place id" })
  @ApiCreatedResponse({
    description: "Létrehozza a helyhez tartozó kategóriákat",
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        category: { type: "string", example: "bar" },
        placeID: { type: "number", example: 1 }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "A helynek már fel van véve ez a kategória",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Place already has this category!" }
      }
    }
  })
  @Post(':placeID/category')
  @SkipThrottle({ basic: true, place: true, login: true })
  async addPlaceCategory(
    @Param('placeID', ParseIntPipe) placeID: number,
    @Body() body: CreatePlaceCategoryDto,
  ) {
    return this.placeService.addPlaceCategory(body, placeID);
  }

  /*
  ----------------------------------------------------------------------------------------------------------
  POST news by placeID
  ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "Hozzáad a helyhez egy hírt" })
  @ApiCookieAuth()
  @ApiParam({ name: "id", description: "place id" })
  @ApiCreatedResponse({
    description: "Sikeresen létrehozta a hírt",
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        text: { type: "string", example: "Helyhez tartazó hír szövege" },
        placeID: { type: "number", example: 1 },
        userID: { type: "number", example: 1 },
        approved: { type: "boolean", example: false }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "A helynek már van ilyen kategóriája",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Place already has this category!" }
      }
    }
  })
  @Post(':id/news')
  @UseGuards(AuthGuard)
  @SkipThrottle({ basic: true, place: true, login: true })
  async addNews(@Req() request: Request, @Body() body: CreateNewsDto) {
    return this.placeService.addNews(body, request['user'].sub);
  }

  /*
  ----------------------------------------------------------------------------------------------------------
  PUT news by newsID
  ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "Módosít egy hírt id alapján" })
  @ApiCookieAuth()
  @ApiParam({ name: "id", description: "news id" })
  @ApiOkResponse({
    description: "Sikeresen módosítja a hírt",
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        text: { type: "string", example: "Helyhez tartazó hír módosított szövege" },
        placeID: { type: "number", example: 1 },
        userID: { type: "number", example: 1 },
        approved: { type: "boolean", example: false }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "A felhasználó csak a saját kommentjét módosíthatja",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "You can only edit your own news!" }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: "Csak bejelentkezett felhasználó módosíthat híreket",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "You can not edit this news!" }
      }
    }
  })
  @Put('/news/:id')
  @UseGuards(AuthGuard)
  @SkipThrottle({ basic: true, place: true, login: true })
  async updateNews(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
    @Body() body: UpdateNewsDto,
  ) {
    return this.placeService.updateNews(id, body, request['user'].sub);
  }

  /*
  ----------------------------------------------------------------------------------------------------------
  GET all news by placeID
  ----------------------------------------------------------------------------------------------------------
  */

  @ApiOperation({ summary: "Visszadja a helyhez tartozó híreket" })
  @ApiParam({ name: "placeID", description: "place id" })
  @ApiOkResponse({
    description: "Visszadja a híreket",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          text: { type: "string", example: "Test news text." },
          placeID: { type: "number", example: 1 },
          userID: { type: "number", example: 1 }
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: "Nincs a helyhez komment",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "No news available for this place!" }
      }
    }
  })
  @Get(':placeID/news')
  @SkipThrottle({ postput: true, place: true, login: true })
  async getNews(@Param('placeID', ParseIntPipe) placeID: number) {
    return this.placeService.getNews(placeID)
  }
}
