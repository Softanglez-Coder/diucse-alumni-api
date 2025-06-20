import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommitteeService } from './committee.service';
import { CreateCommitteeDto, UpdateCommitteeDto } from './dtos';
import { BaseController, Public, Role, Roles } from '@core';
import { CommitteeDocument } from './committee.schema';

@Controller('committees')
export class CommitteeController extends BaseController<CommitteeDocument> {
  constructor(private readonly committeeService: CommitteeService) {
    super(committeeService);
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() dto: CreateCommitteeDto) {
    return await this.committeeService.create(dto);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.committeeService.findById(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<UpdateCommitteeDto>,
  ) {
    return await this.committeeService.update(id, dto);
  }
}
