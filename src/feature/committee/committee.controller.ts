import { Controller, Get, NotImplementedException, Patch, Post } from '@nestjs/common';

@Controller('committee')
export class CommitteeController {
    // committee
    @Post()
    async createCommittee() {
        throw new NotImplementedException();
    }

    @Get()
    async findAllCommittees() {
        throw new NotImplementedException();
    }

    @Get(':id')
    async findCommitteeById() {
        throw new NotImplementedException();
    }

    @Patch(':id')
    async updateCommittee() {
        throw new NotImplementedException();
    }

    // committee designation
    @Post('designation')
    async createCommitteeDesignation() {
        throw new NotImplementedException();
    }

    @Get('designation')
    async findAllCommitteeDesignations() {
        throw new NotImplementedException();
    }

    @Get('designation/:id')
    async findCommitteeDesignationById() {
        throw new NotImplementedException();
    }

    @Patch('designation/:id')
    async updateCommitteeDesignation() {
        throw new NotImplementedException();
    }

    // committee member
    @Post('member')
    async createCommitteeMember() {
        throw new NotImplementedException();
    }

    @Get(':id/member')
    async findAllCommitteeMembersByCommitteeId() {
        throw new NotImplementedException();
    }
}
