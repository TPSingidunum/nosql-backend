import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Driver } from 'neo4j-driver';
import { CreateUserDto } from 'src/dtos/CreateUserDto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { FollowUserDto } from 'src/dtos/FollowUserDto';

@Injectable()
export class UserService {
  constructor(
    @Inject("NEO4J_DRIVER") private readonly driver: Driver,
    @Inject("NEO4J_DATABASE") private readonly database: string
  ) { }

  async createUser(userData: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Ukoliko zelite da precizirate koju bazu koristiti
    // const session = this.driver.session({database: "social"})
    const session = this.driver.session({ database: this.database })

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

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Zapravi korisnika
  async followUser(followUser: FollowUserDto): Promise<boolean> {
    const session = this.driver.session({ database: this.database })

    const fromExists = await session.run(
      'MATCH (u:User { username: $username}) RETURN u',
      {
        username: followUser.fromUsername
      }
    )

    if (fromExists.records.length = 0) {
      throw new BadRequestException("Korisnik sa ovim username-om postoji")
    }

    const toExists = await session.run(
      'MATCH (u:User { username: $username}) RETURN u',
      {
        username: followUser.toUsername
      }
    )

    if (fromExists.records.length = 0) {
      throw new BadRequestException("Korsinik kojeg ste hteli da zapratite ne postoji")
    }

    const createFollowQuery = await session.run(
      'MATCH (u:User { username: $fromUsername}), (u2:User { username: $toUsername}) CREATE (u)-[r:FOLLOWS]->(u2) RETURN r',
      {
        fromUsername: followUser.fromUsername,
        toUsername: followUser.toUsername,
      }
    )

    session.close();

    if (createFollowQuery.records.length < 1) {
      return false;
    }

    return true;
  }


  // Odprati korisnika
  async unfollowUser(followUser: FollowUserDto): Promise<boolean> {
    const session = this.driver.session({ database: this.database })

    const fromExists = await session.run(
      'MATCH (u:User { username: $username}) RETURN u',
      {
        username: followUser.fromUsername
      }
    )

    if (fromExists.records.length = 0) {
      throw new BadRequestException("Korisnik sa ovim username-om postoji")
    }

    const toExists = await session.run(
      'MATCH (u:User { username: $username}) RETURN u',
      {
        username: followUser.toUsername
      }
    )

    if (fromExists.records.length = 0) {
      throw new BadRequestException("Korsinik kojeg ste hteli da zapratite ne postoji")
    }

    const deleteFollowQuery = await session.run(
      'MATCH (u:User { username: $fromUsername})-[r:FOLLOWS]->(u2:User { username: $toUsername}) DELETE r',
      {
        fromUsername: followUser.fromUsername,
        toUsername: followUser.toUsername,
      }
    )

    session.close();

    if (deleteFollowQuery.records.length > 0) {
      return false;
    }
    return true;
  }

  // Dohvati sve korisnike koje prate odredjenog korisnika
  async getUserFollowers(username: string): Promise<Omit<User, 'password'>[]> {
    const session = this.driver.session({ database: this.database })

    const fromExists = await session.run(
      'MATCH (u:User { username: $username}) RETURN u',
      {
        username: username
      }
    )

    if (fromExists.records.length = 0) {
      throw new BadRequestException("Korisnik sa ovim username-om postoji")
    }

    const getUserFollowersQuery = await session.run(
      'MATCH (:User { username: $username})<-[:FOLLOWS]-(u:User) RETURN u',
      {
        username: username
      }
    )

    session.close();

    const data = getUserFollowersQuery.records.map(record => {
      const bareRecord = record.get('u').properties;

      return {
        id: bareRecord.id, 
        username: bareRecord.username,
        email: bareRecord.email,
        createdAt: bareRecord.createdAt 
      }
    })

    return data;
  }

}
