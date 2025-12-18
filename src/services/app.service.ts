import { Inject, Injectable } from '@nestjs/common';
import { Driver } from 'neo4j-driver';

@Injectable()
export class AppService {
  constructor(
    @Inject("NEO4J_DRIVER") private readonly driver: Driver
  ) {}


  getHello(): string {
    return 'Hello World!';
  }
}
