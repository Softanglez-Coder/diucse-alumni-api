import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseService } from '@core';
import { CommitteeRepository } from './committee.repository';
import { CommitteeDocument } from './committee.schema';
import {
  CreateCommitteeDto,
  UpdateCommitteeDto,
  PublishCommitteeDto,
} from './dtos';

@Injectable()
export class CommitteeService extends BaseService<CommitteeDocument> {
  constructor(private readonly committeeRepository: CommitteeRepository) {
    super(committeeRepository);
  }

  async createCommittee(
    createCommitteeDto: CreateCommitteeDto,
  ): Promise<CommitteeDocument> {
    const { name, startDate, endDate } = createCommitteeDto;

    // Set default period to one year if not provided
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate
      ? new Date(endDate)
      : new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());

    // Validate dates
    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    const committeeData = {
      name,
      startDate: start,
      endDate: end,
      isPublished: false,
    };

    return await this.repository.create(committeeData);
  }

  async updateCommittee(
    id: string,
    updateCommitteeDto: UpdateCommitteeDto,
  ): Promise<CommitteeDocument> {
    const updateData: any = { ...updateCommitteeDto };

    // Convert date strings to Date objects if provided
    if (updateCommitteeDto.startDate) {
      updateData.startDate = new Date(updateCommitteeDto.startDate);
    }
    if (updateCommitteeDto.endDate) {
      updateData.endDate = new Date(updateCommitteeDto.endDate);
    }

    // If both dates are being updated, validate them
    if (
      updateData.startDate &&
      updateData.endDate &&
      updateData.endDate <= updateData.startDate
    ) {
      throw new BadRequestException('End date must be after start date');
    }

    // If only one date is being updated, validate against existing data
    if (updateData.startDate || updateData.endDate) {
      const existing = await this.repository.findById(id);
      if (!existing) {
        throw new BadRequestException('Committee not found');
      }

      const startDate = updateData.startDate || existing.startDate;
      const endDate = updateData.endDate || existing.endDate;

      if (endDate <= startDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    return await this.repository.update(id, updateData);
  }

  async publishCommittee(
    id: string,
    publishCommitteeDto: PublishCommitteeDto,
  ): Promise<CommitteeDocument> {
    return await this.repository.update(id, {
      isPublished: publishCommitteeDto.isPublished,
    });
  }

  async getPublishedCommittees(): Promise<CommitteeDocument[]> {
    return await this.repository.findAll({ filter: { isPublished: true } });
  }

  async getCurrentCommittee(): Promise<CommitteeDocument | null> {
    const now = new Date();
    const committees = await this.repository.findAll({
      filter: {
        isPublished: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      },
      limit: 1,
      sortBy: 'startDate',
      sort: 'desc', // Get the most recent current committee if multiple exist
    });

    return committees.length > 0 ? committees[0] : null;
  }

  async getPreviousCommittees(): Promise<CommitteeDocument[]> {
    const now = new Date();
    return await this.repository.findAll({
      filter: {
        isPublished: true,
        endDate: { $lt: now },
      },
      sortBy: 'endDate',
      sort: 'desc', // Most recent first
    });
  }

  async getUpcomingCommittees(): Promise<CommitteeDocument[]> {
    const now = new Date();
    return await this.repository.findAll({
      filter: {
        isPublished: true,
        startDate: { $gt: now },
      },
      sortBy: 'startDate',
      sort: 'asc', // Earliest upcoming first
    });
  }
}
