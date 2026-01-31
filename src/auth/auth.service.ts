import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(email)

        if (!user) {
            throw new NotFoundException("Invalid email or password!")
        }

        const isPasswordValid = await bcrypt.compare(pass, user.password)
        
        if (!isPasswordValid) {
            throw new UnauthorizedException()
        }

        const payload = { sub: user.id, email: user.email}

        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
