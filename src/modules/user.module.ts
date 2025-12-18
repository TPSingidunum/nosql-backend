import { Module } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { UserController } from 'src/controllers/user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
