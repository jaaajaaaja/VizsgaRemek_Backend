import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateUserInterestDto } from './dto/create-user-interest.dto';
import { FriendRequestDto } from './dto/friend-request.dto';
import { ApiConflictResponse, ApiCookieAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    /*
    ----------------------------------------------------------------------------------------------------------
    GET all user interests
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "ADMIN - Visszaadja az összes felhasználó érdekeltséget" })
    @ApiCookieAuth()
    @ApiOkResponse({
        description: "Visszaadja a felhasználókat",
        schema: {
            type: "array",
            items: {
                properties: {
                    id: { type: "number", example: 1 },
                    userName: { type: "string", example: "Felhasználónév" },
                    email: { type: "string", example: "felhasznalonev@email.com" },
                    age: { type: "number", example: 1 },
                    role: { type: "string", example: "user" },
                }
            }
        }
    })
    @ApiForbiddenResponse({
        description: "Csak adminnak van hozzáférése a végponthoz",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Forbidden resource!" }
            }
        }
    })
    @Get("/allInterests")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("admin")
    @SkipThrottle({ postput: true, place: true, login: true })
    getAllUserInterestByAdmin() {
        return this.userService.getAllUserInterestByAdmin()
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    GET all
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "ADMIN - Visszaadja az összes felhasználót" })
    @ApiCookieAuth()
    @ApiOkResponse({
        description: "Visszaadja a felhasználókat",
        schema: {
            type: "array",
            items: {
                properties: {
                    id: { type: "number", example: 1 },
                    userName: { type: "string", example: "Felhasználónév" },
                    email: { type: "string", example: "felhasznalonev@email.com" },
                    age: { type: "number", example: 1 },
                    role: { type: "string", example: "user" },
                }
            }
        }
    })
    @ApiForbiddenResponse({
        description: "Csak adminnak van hozzáférése a végponthoz",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Forbidden resource!" }
            }
        }
    })
    @Get("/all")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("admin")
    @SkipThrottle({ postput: true, place: true, login: true })
    getAllNews() {
        return this.userService.getAllUsers()
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    GET recommends a place
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "Visszaad egy helyet a felhasználó érdekeltségi köre alapján" })
    @ApiCookieAuth()
    @ApiOkResponse({
        description: "Visszaad egy helyet",
        schema: {
            type: "object",
            properties: {
                id: { type: "number", example: 1 },
                googleplaceID: { type: "string", example: "123ID" },
                name: { type: "string", example: "felhasználónév" },
                address: { type: "string", example: "123 Utca" },
                comments: { type: "string", example: "[kommentek listája]" }
            }
        }
    })
    @ApiForbiddenResponse({
        description: "Nem talált megfelelő helyet az adatbázisban",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "No places found matching your interests!" }
            }
        }
    })
    @ApiNotFoundResponse({
        description: "A felhasználónak nincsenek érekeltségei",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "User has no interests!" }
            }
        }
    })
    @Get('/recommendation')
    @UseGuards(AuthGuard)
    @SkipThrottle({ postput: true, place: true, login: true })
    async recommendations(@Req() request: Request) {
        return this.userService.recommendations(request["user"].sub)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    GET recommends a places by age
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "Visszaad 5 helyet a felhasználó kora alapján (többi felhasználó kommentjeit veszi figyelembe)" })
    @ApiCookieAuth()
    @ApiOkResponse({
        description: "Visszaad 5 helyet",
        schema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    googleplaceID: { type: "string", example: "123ID" },
                    name: { type: "string", example: "felhasználónév" },
                    address: { type: "string", example: "123 Utca" },
                    comments: { type: "string", example: "[kommentek listája]" }
                }
            }
        }
    })
    @ApiForbiddenResponse({
        description: "Nem található elég komment az ajánláshoz",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Not enough comments to recommend!" }
            }
        }
    })
    @ApiNotFoundResponse({
        description: "Nem található a felhasználó",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "User not found!" }
            }
        }
    })
    @ApiConflictResponse({
        description: "Nincs beállítva a felhasználónak kor",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Please set your age!" }
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: "Csak bejelentkezve lehet lekérni",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Log in first!" }
            }
        }
    })
    @Get('/recommendation/age')
    @UseGuards(AuthGuard)
    @SkipThrottle({ postput: true, place: true, login: true })
    async recommendByAge(@Req() request: Request) {
        return this.userService.recommendByAge(request["user"].sub)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    POST user
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "Létrehoz egy felhasználót" })
    @ApiOkResponse({
        description: "Létrehozza a felhasználót",
        schema: {
            type: "object",
            properties: {
                userName: { type: "string", example: "felhaszálónév" },
                email: { type: "string", example: "pelda@pelda.pelda" },
                password: { type: "string", example: "asd123" },
                age: { type: "number", example: 18 }
            }
        }
    })
    @ApiConflictResponse({
        description: "Már benne van az adatbázisban az email cím",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Email already in use!" }
            }
        }
    })
    @Post()
    @SkipThrottle({ basic: true, place: true, login: true })
    async add(@Body() body: CreateUserDto) {
        return this.userService.add(body)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    POST user interest by id
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "Hozzáad egy felhasználó érdekeltséget" })
    @ApiCookieAuth()
    @ApiOkResponse({
        description: "Létrehozza az érdekeltséget",
        schema: {
            type: "object",
            properties: {
                interest: { type: "string", example: "bar" },
                userID: { type: "number", example: 1 }
            }
        }
    })
    @ApiConflictResponse({
        description: "A felhasználónak már be van állítva az érdekeltség",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "You already have this interest!" }
            }
        }
    })
    @Post('/addInterest')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async addUserInterest(@Body() body: CreateUserInterestDto, @Req() request: Request) {
        return this.userService.addUserInterest(body, request["user"].sub)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    DELETE user by id
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "Töröl egy felhasználót" })
    @ApiCookieAuth()
    @ApiParam({ name: "id", description: "felhasználó id" })
    @ApiOkResponse({
        description: "Kitörli a felhasználót",
        schema: {
            type: "object",
            properties: {
                id: { type: "number", example: 1 },
                userName: { type: "string", example: "felhaszálónév" },
                email: { type: "string", example: "pelda@pelda.pelda" },
                password: { type: "string", example: "asd123" },
                age: { type: "number", example: 18 }
            }
        }
    })
    @ApiForbiddenResponse({
        description: "A felhasználó csak a saját profilját törölheti",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "You can only delete your own profile!" }
            }
        }
    })
    @Delete(':id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ postput: true, place: true, login: true })
    async remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
        return this.userService.remove(id, request["user"])
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    PUT user by id
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "Módosít egy felhasználót" })
    @ApiCookieAuth()
    @ApiParam({ name: "id", description: "felhasználó id" })
    @ApiOkResponse({
        description: "Módosítja a felhasználót",
        schema: {
            type: "object",
            properties: {
                id: { type: "number", example: 1 },
                userName: { type: "string", example: "módosított felhaszálónév" },
                email: { type: "string", example: "pelda@pelda.pelda" },
                password: { type: "string", example: "asd123" },
                age: { type: "number", example: 18 }
            }
        }
    })
    @ApiForbiddenResponse({
        description: "A felhasználó csak a saját profilját módosíthatja",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "You can only edit your own profile!" }
            }
        }
    })
    @ApiNotFoundResponse({
        description: "A felhasználó nem használható",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "User not found!" }
            }
        }
    })
    @Put(':id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto, @Req() request: Request) {
        return this.userService.update(id, body, request["user"].sub)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    POST friend request by userID
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "Elküldi egy barátkérelmet" })
    @ApiCookieAuth()
    @ApiParam({ name: "id", description: "barát felhasználó id-ja" })
    @ApiOkResponse({
        description: "Elküldi a kérelmet",
        schema: {
            type: "object",
            properties: {
                userID: { type: "number", example: 1 },
                friendID: { type: "number", example: 2 },
            }
        }
    })
    @ApiConflictResponse({
        description: "Már van függőben egy barátkérelem ehhez a felhasználóhoz",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "You already sent a request to this user!" }
            }
        }
    })
    @ApiForbiddenResponse({
        description: "Már a barátod ez a felhasználó",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "You already have this user as a friend!" }
            }
        }
    })
    @ApiNotFoundResponse({
        description: "A felhasználó, akinek a kérelmet küldöd, nem használható",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "The user you are trying to send the request to does not exist!" }
            }
        }
    })
    @Post('/addFriend/:id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async addFriend(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
        return this.userService.addFriend(id, request["user"].sub)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    POST deals with friend request by sender's userID
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "Elfogadja vagy elutasítja egy barátkérelmet" })
    @ApiCookieAuth()
    @ApiParam({ name: "id", description: "kérelmet küldő felhasználó id-ja" })
    @ApiOkResponse({
        description: "Elfogadja a kérelmet",
        schema: {
            type: "object",
            properties: {
                userID: { type: "number", example: 1 },
                friendID: { type: "number", example: 2 },
            }
        }
    })
    @ApiNotFoundResponse({
        description: "A felhasználótól nincs függőben barátkérelmed",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "You do not have a pending friend request from this user!" }
            }
        }
    })
    @Post('/dealWithFriendRequest')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async dealWithFriendRequest(@Req() request: Request, @Body() body: FriendRequestDto) {
        return this.userService.dealWithFriendRequest(
            body.recievedFromUserId,
            request["user"].sub,
            body.accepted
        )
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    GET user by userName
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "Felhasználóra keres felasználónév alapján" })
    @ApiParam({ name: "userName", description: "keresett felhasználó neve" })
    @ApiOkResponse({
        description: "Visszaadja a felhasználót",
        schema: {
            type: "object",
            properties: {
                id: { type: "number", example: 1 },
                userName: { type: "string", example: "felhasználónév" }
            }
        }
    })
    @Get("/searchByName/:userName")
    @SkipThrottle({ basic: true, place: true, login: true })
    async searchByUsername(@Param('userName') username: string) {
        return this.userService.searchByUsername(username)
    }

    /*
    ----------------------------------------------------------------------------------------------------------
    GET friends
    ----------------------------------------------------------------------------------------------------------
    */

    @ApiOperation({ summary: "Felhasználó barátainak lekérése" })
    @ApiCookieAuth()
    @ApiOkResponse({
        description: "Visszaadja a felhasználó barátait",
        schema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    userName: { type: "string", example: "felhasználónév" }
                }
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: "Csak bejelentkezett felhasználó kérheti le a barátlistáját",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "Log in to see your friendlist!" }
            }
        }
    })
    @ApiNotFoundResponse({
        description: "Nincs barátja a felhasználónak",
        schema: {
            type: "object",
            properties: {
                message: { type: "string", example: "You do not have any friends yet!" }
            }
        }
    })
    @Get('/friends')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async friendlist(@Req() request: Request) {
        return this.userService.friendlist(request["user"].sub)
    }
}
