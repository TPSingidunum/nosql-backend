import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostService } from 'src/services/post.service';
import { CreatePostDto } from 'src/dtos/CreatePostDto';
import { Post as PostEntity} from 'src/entities/post.entity';

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post("create")
  async createPost(@Body() postData: CreatePostDto): Promise<PostEntity|null> {
    return await this.postService.createPost(postData);
  }
}
