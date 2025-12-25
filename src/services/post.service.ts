import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Driver } from 'neo4j-driver';
import { User } from 'src/entities/user.entity';
import { FollowUserDto } from 'src/dtos/FollowUserDto';
import { Post } from 'src/entities/post.entity';
import { CreatePostDto } from 'src/dtos/CreatePostDto';

// export interface Post {
//     id: string;
//     name: string;
//     img: string;
//     content: string;
// }

@Injectable()
export class PostService {
  constructor(
    @Inject("NEO4J_DRIVER") private readonly driver: Driver,
    @Inject("NEO4J_DATABASE") private readonly database: string
  ) { }

  async createPost(postData: CreatePostDto): Promise<Post|null> {
    const session = this.driver.session({ database: this.database })

    const createPostQuery = await session.run(
      'CREATE (p:Post { name: $name, content: $content, img: $img, slug: $slug }) RETURN p',
      {
        name: postData.name,
        img: postData.img,
        content: postData.content,
        slug: postData.slug
      }
    )

    const post: Post = createPostQuery.records[0].get('p').properties;

    const createPostRelation = await session.run(
      'MATCH (p:Post { slug: $slug }), (u:User { username: $username}) CREATE (u)-[r:POSTED { createdAt: datetime()}]->(p) RETURN r',
      {
        slug: post.slug,
        username: postData.username,
      }
    )

    session.close();

    if (createPostRelation.records.length < 1) {
      return null;
    }

    return post;
  }

}
