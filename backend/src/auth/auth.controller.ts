import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { Response } from "express";
import { IUser } from "src/users/interface/user.interface";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "src/users/users.service";

@ApiTags('auth') // Swagger tag
@Controller('auth') // route
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ResponseMessage('Login successfully')
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @Post('register')
  @ResponseMessage('Register a user successfully')
  async register(@Body() user: RegisterUserDto) {
    return this.authService.register(user);
  }


  @ResponseMessage('Get user information successfully')
  @Get('account')
  async getAccount(@User() user: IUser) {
    const result: any = await this.userService.findOne(user._id);
    return {
      user: {
        _id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
        gender: result.gender,
        age: result.age,
        address: result.address,
      }
    }
    // return { user };
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('refresh')
  async getAccountByRefreshToken(@Res() req, @Res() res) {
    const refreshToken = req.cookies['refresh_token'];

    return await this.authService.issueNewAccesToken(refreshToken, res);
  }

  @ResponseMessage('Logout successfully')
  @Post('logout')
  async handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return await this.authService.logout(user, response);
  }
}
