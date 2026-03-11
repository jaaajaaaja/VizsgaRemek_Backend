import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateUserInterestDto } from './dto/create-user-interest.dto';
import { FriendRequestDto } from './dto/friend-request.dto';
import { Roles } from '../auth/roles.decorator';
import {
    AddUserFriend, DealWithFriendRequest, DeleteUser, DeleteUserInterest, GetAllUserInterestsAdmin, GetAllUsersAdmin, GetFriendList,
    GetRecommendationByAge, GetRecommendedPlaces, GetUserInterestList, PostUser, PostUserInterest, SearchByUsername, UpdateUser
} from '../decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    /*
        ----------------------------------------------------------------------------------------------------------
        DEFAULT ENDPOINTS
        ----------------------------------------------------------------------------------------------------------
    */

    //GET all

    @GetAllUsersAdmin()
    @Get("/all")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("admin")
    @SkipThrottle({ postput: true, place: true, login: true })
    getAllNews() {
        return this.userService.getAllUsers()
    }

    //POST user

    @PostUser()
    @Post()
    @SkipThrottle({ basic: true, place: true, login: true })
    async add(@Body() body: CreateUserDto) {
        return this.userService.add(body)
    }

    //DELETE user by id

    @DeleteUser()
    @Delete(':id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ postput: true, place: true, login: true })
    async remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
        return this.userService.remove(id, request["user"])
    }

    //PUT user by id

    @UpdateUser()
    @Put(':id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto, @Req() request: Request) {
        return this.userService.update(id, body, request["user"].sub)
    }

    /*
        ----------------------------------------------------------------------------------------------------------
        RECOMMENDATIONS
        ----------------------------------------------------------------------------------------------------------
    */

    //GET recommends a place

    @GetRecommendedPlaces()
    @Get('/recommendation')
    @UseGuards(AuthGuard)
    @SkipThrottle({ postput: true, place: true, login: true })
    async recommendations(@Req() request: Request) {
        return this.userService.recommendations(request["user"].sub)
    }

    //GET recommends a places by age

    @GetRecommendationByAge()
    @Get('/recommendation/age')
    @UseGuards(AuthGuard)
    @SkipThrottle({ postput: true, place: true, login: true })
    async recommendByAge(@Req() request: Request) {
        return this.userService.recommendByAge(request["user"].sub)
    }

    /*
        ----------------------------------------------------------------------------------------------------------
        FRIENDS
        ----------------------------------------------------------------------------------------------------------
    */

    //GET user by userName

    @SearchByUsername()
    @Get("/searchByName/:userName")
    @SkipThrottle({ basic: true, place: true, login: true })
    async searchByUsername(@Param('userName') username: string) {
        return this.userService.searchByUsername(username)
    }

    //GET friends

    @GetFriendList()
    @Get('/friends')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async friendlist(@Req() request: Request) {
        return this.userService.friendlist(request["user"].sub)
    }

    //POST friend request by userID

    @AddUserFriend()
    @Post('/addFriend/:id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async addFriend(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
        return this.userService.addFriend(id, request["user"].sub)
    }

    //POST deals with friend request by sender's userID

    @DealWithFriendRequest()
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
        INTERESTS
        ----------------------------------------------------------------------------------------------------------
    */

    //POST user interest by id    

    @PostUserInterest()
    @Post('/addInterest')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async addUserInterest(@Body() body: CreateUserInterestDto, @Req() request: Request) {
        return this.userService.addUserInterest(body, request["user"].sub)
    }

    //GET user interests    

    @GetUserInterestList()
    @Get('/interests')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async interestlist(@Req() request: Request) {
        return this.userService.interestList(request["user"].sub)
    }

    //GET all user interests

    @GetAllUserInterestsAdmin()
    @Get("/allInterests")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("admin")
    @SkipThrottle({ postput: true, place: true, login: true })
    getAllUserInterestByAdmin() {
        return this.userService.getAllUserInterestByAdmin()
    }

    //DELETE user interest by id

    @DeleteUserInterest()
    @Delete('/deleteInterest/:id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async deleteUserInterest(@Param(":id", ParseIntPipe) id: number, @Req() request: Request) {
        return this.userService.deleteUserInterest(id, request["user"].sub)
    }
}
