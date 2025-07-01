import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { BaseController, Public, Role, Roles } from '@core';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dtos';
import { RequestExtension } from 'src/core/types';
import { Blog, BlogDocument } from './blog.schema';
import { BlogType } from './blog-type';

@Controller('blogs')
export class BlogController extends BaseController<BlogDocument> {
  constructor(private readonly blogService: BlogService) {
    super(blogService);
  }

  @Roles(Role.Member)
  @Post()
  async create(@Req() req: RequestExtension, @Body() dto: CreateBlogDto) {
    const blog: Blog = {
      author: req.user.id as any,
      title: dto.title,
      content: dto.content,
      type: dto.type,
    };

    return await this.blogService.create(blog);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.blogService.findById(id);
  }

  @Roles(Role.Member)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return await this.blogService.update(id, dto);
  }

  @Roles(Role.Publisher)
  @Patch(':id/publish')
  async publish(@Param('id') id: string) {
    return await this.blogService.publish(id);
  }

  @Roles(Role.Publisher)
  @Patch(':id/unpublish')
  async unpublish(@Param('id') id: string) {
    return await this.blogService.unpublish(id);
  }

  @Get('types')
  async getTypes(): Promise<string[]> {
    return Object.values(BlogType);
  }
}
