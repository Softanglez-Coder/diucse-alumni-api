import { Public, Role, Roles } from '@core';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateCommitteeDesignationDto,
  UpdateCommitteeDesignationDto,
} from './dtos';
import { CommitteeDesignationService } from './commitee-designation.service';

@Controller('committee-designations')
export class CommitteeDesignationController {
  constructor(
    private readonly committeeDesignationService: CommitteeDesignationService,
  ) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() dto: CreateCommitteeDesignationDto) {
    return await this.committeeDesignationService.create(dto);
  }

  @Public()
  @Get()
  async findAll(@Query('limit') limit: number = 100) {
    return await this.committeeDesignationService.findAll({
      limit: limit,
    });
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
