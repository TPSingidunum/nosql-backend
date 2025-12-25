import { Module } from '@nestjs/common';
import { DbModule } from './db.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';
import { PostModule } from './post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DbModule,
    UserModule,
    PostModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
