import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InstituteService } from './institute.service';
import { CreateInstituteDto } from './institute.dto';

@Controller('admin/institutes')
export class InstituteController {
    constructor(private readonly service: InstituteService) { }

    @Post()
    create(@Body() dto: CreateInstituteDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
