import { Body, Controller, Get, Post } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Public, Role, Roles } from '@core';
import { CreateBatchDto } from './dtos';

@Controller('batch')
export class BatchController {
    constructor(
        private readonly batchService: BatchService
    ) {}

    @Public()
    @Get()
    async findAll() {
        return this.batchService.findAll({
            sort: 'asc',
            sortBy: 'name',
            limit: 1_000
        });
    }

    @Roles(
        Role.SuperAdmin,
        Role.Admin
    )
    @Post()
    async create(@Body() body: CreateBatchDto) {
        return this.batchService.create(body);
    }
}
