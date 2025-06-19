import { BaseService } from '@core';
import { Get, Injectable } from '@nestjs/common';
import { CommitteeDocument } from './committee.schema';
import { CommitteeRepository } from './committee.repository';

@Injectable()
export class CommitteeService extends BaseService<CommitteeDocument> {
  constructor(private readonly committeeRepository: CommitteeRepository) {
    super(committeeRepository);
  }
}
