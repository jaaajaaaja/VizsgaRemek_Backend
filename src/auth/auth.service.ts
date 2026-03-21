import { Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import chalk from 'chalk';
import { SignInType } from 'src/types/auth-types';
import { LoggedInUser } from 'src/types/user-types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async signIn(email: string, pass: string): Promise<SignInType> {
    // console.log(chalk.yellow("\n--------------------------------------------"))
    // console.log(`\n${chalk.yellow("Login attempt:")}
    //   ${chalk.rgb(128, 0, 128)("email: ")}${chalk.green(email ? email : "undefiend")}
    //   ${chalk.rgb(128, 0, 128)("password:")} ${chalk.green(pass ? "***" : "undefined")}`
    // )

    const user = await this.userService.findOne(email)

    if (!user) {
      throw new NotFoundException()
    }

    // console.log(`${chalk.yellow("\nUser found:")} 
    //   ${chalk.rgb(128, 0, 128)("email:")} ${chalk.green(user.email)} 
    //   ${chalk.rgb(128, 0, 128)("password:")} ${chalk.green("***")} `
    // )

    const isPasswordValid = await bcrypt.compare(pass, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException()
    }

    // console.log(`\n${chalk.yellow("user logged in successfully:")}
    //   ${chalk.rgb(128, 0, 128)("id:")} ${chalk.green(user.id)}
    //   ${chalk.rgb(128, 0, 128)("email:")} ${chalk.green(user.email)}
    //   `
    // )
    // console.log(chalk.yellow("--------------------------------------------"))

    const payload: LoggedInUser = { sub: user.id, email: user.email, role: user.role }

    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user.id,
      email: user.email,
      role: user.role,
    }
  }

  async getProfile(loggedInUserId: number) {
    return await this.userService.getUserData(loggedInUserId)
  }
}
