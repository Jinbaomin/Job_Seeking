import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (user) {
      const isValidPassword = this.usersService.checkPassword(pass, user.password);
      if (isValidPassword) {
        return user;
      }
    }

    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role, gender, age, address } = user;

    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      name,
      email,
      role,
      gender,
      age,
      address
    };

    const refresh_token = this.createRefreshToken(payload);

    // update user with refresh token when login successfully
    await this.usersService.updateRefreshToken(_id, refresh_token);

    // set refresh token in cookie
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true, // true if using https
      maxAge: 3600, // 1 hour
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
        age,
        address
      }
    };
  }

  async register(user: RegisterUserDto) {
    const createdUser = await this.usersService.create(user);

    return {
      _id: createdUser._id,
      createdAt: createdUser.createdAt
    }
  }

  createRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRATION_TIME"),
    });
  }

  async issueNewAccesToken(refreshToken: string, @Res() res) {
    try {
      await this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN"),
      });

      const user = await this.usersService.findByRefreshToken(refreshToken);

      if (!user) {
        throw new BadRequestException('Invalid refresh token');
      }

      const { _id, name, email, role } = user;
      const payload = {
        sub: "token login",
        iss: "from server",
        _id,
        name,
        email,
        role
      }

      // Create new access token
      const newAccessToken = this.jwtService.sign(payload);

      // Create new refresh token
      const newRefreshToken = this.createRefreshToken(payload);

      // update new refresh token 
      await this.usersService.updateRefreshToken(_id.toString(), newRefreshToken);

      // set new refresh token in cookie
      res.clearCookie();
      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: true, // true if using https
        maxAge: 3600, // 1 hour
      });

      return res.json({
        access_token: newAccessToken,
        user: {
          _id,
          name,
          email,
          role
        }
      });
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async logout(user: IUser, @Res() res) {
    // Clear the refresh token from the user's record
    await this.usersService.updateRefreshToken(user._id.toString(), null);

    // Clear the cookie
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true, // true if using https
    });
  } 
}