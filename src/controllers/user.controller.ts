import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/dtos/CreateUserDto';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  async createUser(@Body() userData: CreateUserDto): Promise<Omit<User, 'password'>> {
    return await this.userService.createUser(userData);
  }
}
