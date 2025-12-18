import { Module } from '@nestjs/common';
import { DbModule } from './db.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DbModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
