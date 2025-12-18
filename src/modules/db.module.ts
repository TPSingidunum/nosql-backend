import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver } from 'neo4j-driver';

@Global()
@Module({
    providers: [
        {
            provide: "NEO4J_DRIVER",
            useFactory: async (configServis: ConfigService): Promise<Driver> => {
                const URI = configServis.getOrThrow<string>("NEO4J_URI");
                const USER = configServis.getOrThrow<string>("NEO4J_USER")
                const PASSWORD = configServis.getOrThrow<string>("NEO4J_PASSWORD")
                const driver = neo4j.driver(
                    URI,
                    neo4j.auth.basic(USER, PASSWORD)
                )

                return driver;
            },
            inject: [ConfigService]
        }
    ],
    exports: ["NEO4J_DRIVER"]
})
export class DbModule { }