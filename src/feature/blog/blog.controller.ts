import {
  Controller,
  Get,
  NotImplementedException,
  Patch,
  Post,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { Public, Role, Roles } from '@core';

@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Roles(Role.Member)
  @Post()
  async create() {
    throw new NotImplementedException('Method not implemented');
  }

  @Public()
  @Get()
  async findAll() {
    throw new NotImplementedException('Method not implemented');
  }

  @Public()
  @Get(':id')
  async findOne() {
    throw new NotImplementedException('Method not implemented');
  }

  @Roles(Role.Member)
  @Patch(':id')
  async update() {
    throw new NotImplementedException('Method not implemented');
  }

  @Roles(Role.Publisher)
  @Patch(':id/publish')
  async publish() {
    throw new NotImplementedException('Method not implemented');
  }

  @Roles(Role.Publisher)
  @Patch(':id/unpublish')
  async unpublish() {
    throw new NotImplementedException('Method not implemented');
  }
}
