import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Driver } from 'neo4j-driver';
import { CreateUserDto } from 'src/dtos/CreateUserDto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject("NEO4J_DRIVER") private readonly driver: Driver,
    @Inject("NEO4J_DATABASE") private readonly database: string
  ) {}

  async createUser(userData: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Ukoliko zelite da precizirate koju bazu koristiti
    // const session = this.driver.session({database: "social"})
    const session = this.driver.session({ database: this.database})

    const exists = await session.run(
        'MATCH (u:User { username: $username}) RETURN u',
        {
            username: userData.username
        }
    )

    if (exists.records.length > 0) {
        throw new BadRequestException("Korisnik sa ovim username-om postoji")
    }

    const createUserQuery = await session.run(
        'CREATE (u:User { username: $username, email: $email, password: $password, createdAt: datetime() }) RETURN u',
        {
            username: userData.username,
            email: userData.email,
            password: await bcrypt.hash(userData.password, 12)
        }
    )

    const user = createUserQuery.records[0].get('u').properties;
    session.close();    

    const {password, ...userWithoutPassword} = user;
    return userWithoutPassword;
  }
}
