import { Injectable } from '@nestjs/common';
import { BatchRepository } from './batch.repository';

@Injectable()
export class BatchService {
  constructor(private readonly batchRepository: BatchRepository) {}

  async create(name: string) {
    return await this.batchRepository.create(name);
  }

  async findById(id: string) {
    return await this.batchRepository.findById(id);
  }

  async findAll() {
    return await this.batchRepository.findAll();
  }

  async update(id: string, name: string) {
    return await this.batchRepository.update(id, name);
  }

  async delete(id: string) {
    return await this.batchRepository.delete(id);
  }
}
