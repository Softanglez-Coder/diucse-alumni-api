import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto): Promise<Blog> {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  async findAll(): Promise<Blog[]> {
    return this.blogsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Blog | null> {
    return this.blogsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<Blog | null> {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Blog | null> {
    return this.blogsService.remove(id);
  }

  @Put(':id/restore')
  async restore(@Param('id') id: string): Promise<Blog | null> {
    return this.blogsService.restore(id);
  }

  @Delete(':id/confirm')
  async deletePermanently(@Param('id') id: string): Promise<boolean> {
    return this.blogsService.deletePermanently(id);
  }
}
