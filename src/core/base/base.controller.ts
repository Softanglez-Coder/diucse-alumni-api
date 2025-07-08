import {
  Get,
  Query,
  Controller,
  DefaultValuePipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { PaginationOptions } from './pagination-options';
import { Document } from 'mongoose';
import { Public } from '../decorators';
import { Request } from 'express';

@Controller()
export class BaseController<T extends Document> {
  constructor(protected readonly service: BaseService<T>) {}

  @Public()
  @Get()
  async findAll(@Req() req: Request) {
    return this.service.findAll({}, req);
  }
}
