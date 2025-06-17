import { Public, Role, Roles } from '@core';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateCommitteeDesignationDto, UpdateCommitteeDesignationDto } from './dtos';
import { CommitteeDesignationService } from './commitee-designation.service';

@Controller('committee-designation')
export class CommitteeDesignationController {
    constructor(
        private readonly committeeDesignationService: CommitteeDesignationService
    ) {}

    @Roles(Role.Admin)
    @Post()
    async create(
        @Body() dto: CreateCommitteeDesignationDto
    ) {
        return await this.committeeDesignationService.create(dto);
    }

    @Public()
    @Get()
    async findAll() {
        return await this.committeeDesignationService.findAll();
    }

    @Roles(Role.Admin)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        dto: UpdateCommitteeDesignationDto
    ) {
        return await this.committeeDesignationService.update(id, dto);
    }

    @Public()
    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.committeeDesignationService.findById(id);
    }
}
