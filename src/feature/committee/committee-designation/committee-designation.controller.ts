import { BaseController, Role, Roles } from '@core';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import {
  CreateCommitteeDesignationDto,
  UpdateCommitteeDesignationDto,
} from './dtos';
import { CommitteeDesignationService } from './commitee-designation.service';
import { CommitteeDesignationDocument } from './committee-designation.schema';

@Controller('committee-designations')
export class CommitteeDesignationController extends BaseController<CommitteeDesignationDocument> {
  constructor(
    private readonly committeeDesignationService: CommitteeDesignationService,
  ) {
    super(committeeDesignationService);
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() dto: CreateCommitteeDesignationDto) {
    return await this.committeeDesignationService.create(dto);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommitteeDesignationDto,
  ) {
    return await this.committeeDesignationService.update(id, dto);
  }
}
