import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Public, Role, Roles } from '@core';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dtos';
import { RequestExtension } from 'src/core/types';
import { Blog } from './blog.schema';
import { BlogType } from './blog-type';

@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Roles(Role.Member)
  @Post()
  async create(@Req() req: RequestExtension, @Body() dto: CreateBlogDto) {
    const blog: Blog = {
      author: req.user.id as any,
      title: dto.title,
      content: dto.content,
      type: dto.type,
    };

    return await this.service.create(blog);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findById(id);
  }

  @Roles(Role.Member)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return await this.service.update(id, dto);
  }

  @Roles(Role.Publisher)
  @Patch(':id/publish')
  async publish(@Param('id') id: string) {
    return await this.service.publish(id);
  }

  @Roles(Role.Publisher)
  @Patch(':id/unpublish')
  async unpublish(@Param('id') id: string) {
    return await this.service.unpublish(id);
  }

  @Get('types')
  async getTypes(): Promise<string[]> {
    return Object.values(BlogType);
  }
}
