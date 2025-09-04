import { BaseController, Public, Role, Roles } from '@core';
import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { BlogDocument, BlogStatus } from './blog.schema';
import { BlogService } from './blog.service';
import { RequestExtension } from 'src/core/types';
import { CreateBlogDto, UpdateBlogDto } from './dtos';

@Controller('blogs')
export class BlogController extends BaseController<BlogDocument> {
  constructor(private readonly blogService: BlogService) {
    super(blogService);
  }

  @Post()
  async create(
    @Body() body: CreateBlogDto,
    @Req() req: RequestExtension,
  ): Promise<BlogDocument> {
    return this.blogService.create(body, req.user?.id);
  }

  @Public()
  @Get('published')
  async getPublishedBlogs(): Promise<BlogDocument[]> {
    return this.blogService.getPublishedBlogs();
  }

  @Roles(Role.Publisher)
  @Get('in-review')
  async getBlogsInReview(): Promise<BlogDocument[]> {
    return this.blogService.getBlogsInReview();
  }

  @Roles(Role.Member)
  @Get('me/status/:status')
  async getMyBlogsByStatus(
    @Param('status') status: BlogStatus,
    @Req() req: RequestExtension,
  ): Promise<BlogDocument[]> {
    return this.blogService.getMyBlogsByStatus(req.user?.id, status);
  }

  @Roles(Role.Member)
  @Get('me')
  async getMyBlogs(@Req() req: RequestExtension): Promise<BlogDocument[]> {
    return this.blogService.getMyBlogs(req.user?.id);
  }

  @Roles(Role.Member)
  @Patch(':id/draft')
  async draft(@Param('id') id: string): Promise<BlogDocument> {
    return this.blogService.draft(id);
  }

  @Roles(Role.Member)
  @Patch(':id/review')
  async review(@Param('id') id: string): Promise<BlogDocument> {
    return this.blogService.review(id);
  }

  @Roles(Role.Publisher)
  @Patch(':id/publish')
  async publish(@Param('id') id: string): Promise<BlogDocument> {
    return this.blogService.publish(id);
  }

  @Roles(Role.Publisher)
  @Patch(':id/unpublish')
  async unpublish(@Param('id') id: string): Promise<BlogDocument> {
    return this.blogService.unpublish(id);
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') id: string): Promise<BlogDocument> {
    return this.blogService.findById(id);
  }

  @Roles(Role.Member)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBlogDto,
  ): Promise<BlogDocument> {
    return this.blogService.update(id, body);
  }
}
