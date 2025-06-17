import {
  Controller,
  Get,
  NotImplementedException,
  Patch,
  Post,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Public, Role, Roles } from '@core';

@Controller('notice')
export class NoticeController {
  constructor(private readonly service: NoticeService) {}

  @Roles(Role.Publisher)
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

  @Roles(Role.Publisher)
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
