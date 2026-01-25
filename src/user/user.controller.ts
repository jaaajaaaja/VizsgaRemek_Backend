import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'
import { AuthGuard } from 'src/auth/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

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
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(body.password, salt)

        return this.userService.add({
            userName: body.userName,
            email: body.email,
            password: hash
        })
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
}
