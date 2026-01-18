import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    async getAll() {
        return this.userService.findAll()
    }

    @Get(':email')
    async getOne(@Param('email') email: string) {
        return this.userService.findOne(email)
    }

    @Post()
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
    async remove(@Param('id', ParseIntPipe) id:number) {
        return this.userService.remove(id)
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id:number, @Body() body: UpdateUserDto) {
        return this.userService.update(id, body)
    }
}
