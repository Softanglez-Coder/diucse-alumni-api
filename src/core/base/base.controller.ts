import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Controller,
  ParseBoolPipe,
  DefaultValuePipe,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { PaginationOptions } from './pagination-options';
import { Document } from 'mongoose';
import { Public } from '../decorators';

@Controller()
export class BaseController<T extends Document> {
  constructor(protected readonly service: BaseService<T>) {}

  @Public()
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('sortBy') sortBy?: string,
    @Query('filter') filter?: string, // Expecting JSON string for filter
  ) {
    let filterObj: any = {};
    if (filter) {
      try {
        filterObj = JSON.parse(filter);
      } catch {
        filterObj = {};
      }
    }
    const options: PaginationOptions = {
      page,
      limit,
      search,
      sort,
      sortBy,
      filter: filterObj,
    };
    return this.service.findAll(options);
  }
}
