import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CommitteeService } from './committee.service';
import { BaseController, Public, Role, Roles } from '@core';
import {
  CreateCommitteeDto,
  UpdateCommitteeDto,
  PublishCommitteeDto,
} from './dtos';
import { CommitteeDocument } from './committee.schema';
import { Request } from 'express';

@Controller('committees')
export class CommitteeController extends BaseController<CommitteeDocument> {
  constructor(private readonly committeeService: CommitteeService) {
    super(committeeService);
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() body: CreateCommitteeDto) {
    return await this.committeeService.createCommittee(body);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCommitteeDto) {
    return await this.committeeService.updateCommittee(id, body);
  }

  @Roles(Role.Admin)
  @Patch(':id/publish')
  async publish(@Param('id') id: string, @Body() body: PublishCommitteeDto) {
    return await this.committeeService.publishCommittee(id, body);
  }

  @Roles(Role.Admin)
  @Get('published')
  async getPublished() {
    return await this.committeeService.getPublishedCommittees();
  }

  @Public()
  @Get('current')
  async getCurrent() {
    return await this.committeeService.getCurrentCommittee();
  }

  @Public()
  @Get('previous')
  async getPrevious() {
    return await this.committeeService.getPreviousCommittees();
  }

  @Public()
  @Get('upcoming')
  async getUpcoming() {
    return await this.committeeService.getUpcomingCommittees();
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.committeeService.findById(id);
  }
}
