import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommitteeService } from './committee.service';
import { CreateCommitteeDto, UpdateCommitteeDto } from './dtos';
import { Public, Role, Roles } from '@core';

@Controller('committees')
export class CommitteeController {
  constructor(private readonly committeeService: CommitteeService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() dto: CreateCommitteeDto) {
    return await this.committeeService.create(dto);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.committeeService.findAll();
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
