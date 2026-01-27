import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateUserInterestDto } from './dto/create-user-interest.dto';
import { FriendRequestDto } from './dto/friend-request.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('/recommendation')
    @UseGuards(AuthGuard)
    @SkipThrottle({ postput: true, place: true, login: true })
    async recommendations(@Req() request: Request) {
        return this.userService.recommendations(request["user"].sub)
    }

    // @Get(':email')
    // @SkipThrottle({ postput: true, place: true, login: true })
    // async getOne(@Param('email') email: string) {
    //     return this.userService.findOne(email)
    // }

    @Post()
    @SkipThrottle({ basic: true, place: true, login: true })
    async add(@Body() body: CreateUserDto) {
        return this.userService.add(body)
    }

    @Post('/addInterest')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async addUserInterest(@Body() body: CreateUserInterestDto, @Req() request: Request) {
        return this.userService.addUserInterest(body, request["user"].sub)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ postput: true, place: true, login: true })
    async remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
        return this.userService.remove(id, request["user"].sub)
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto, @Req() request: Request) {
        return this.userService.update(id, body, request["user"].sub)
    }

    @Post('/addFriend/:id')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async addFriend(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
        return this.userService.addFriend(id, request["user"].sub)
    }

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

    @Get('/searchByName/:userName')
    @SkipThrottle({ basic: true, place: true, login: true })
    async searchByUsername(@Param('userName') username: string) {
        return this.userService.searchByUsername(username)
    }

    @Get('/friends')
    @UseGuards(AuthGuard)
    @SkipThrottle({ basic: true, place: true, login: true })
    async friendlist(@Req() request: Request) {
        return this.userService.friendlist(request["user"].sub)
    }
}
