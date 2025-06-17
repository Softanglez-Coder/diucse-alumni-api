import { BaseService } from '@core';
import { Injectable } from '@nestjs/common';
import { CommitteeDesignationDocument } from './committee-designation.schema';
import { CommitteeDesignationRepository } from './committee-designation.repository';

@Injectable()
export class CommitteeDesignationService extends BaseService<CommitteeDesignationDocument> {
    constructor(
        private readonly committeeDesignationRepository: CommitteeDesignationRepository
    ) {
        super(committeeDesignationRepository);
    }
}
