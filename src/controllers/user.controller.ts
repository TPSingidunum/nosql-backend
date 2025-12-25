import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/dtos/CreateUserDto';
import { FollowUserDto } from 'src/dtos/FollowUserDto';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  async createUser(@Body() userData: CreateUserDto): Promise<Omit<User, 'password'>> {
    return await this.userService.createUser(userData);
  }
  
  // Guard() -> Interseptor koji ce iz samog upita putem JWT-tokena izvuci username korisnika koji zeli da
  // zaprati drugogo korisnika
  @Post("follow")
  async followUser(@Body() followData: FollowUserDto): Promise<boolean> {
    return await this.userService.followUser(followData);
  }
  
  @Post("unfollow")
  async unfollowUser(@Body() followData: FollowUserDto): Promise<boolean> {
    return await this.userService.unfollowUser(followData);
  }

  @Get("followers/:username")
  async getFollowers(@Param('username') username: string): Promise<Omit<User, 'password'>[]> {
    return await this.userService.getUserFollowers(username);
  }
}
