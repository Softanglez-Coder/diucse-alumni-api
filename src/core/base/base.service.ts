import { Document } from 'mongoose';
import { BaseRepository } from './base.repository';
import { PaginationOptions } from './pagination-options';

export class BaseService<T extends Document> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await this.repository.create(data);
  }

  async findAll(options: PaginationOptions = {}) {
    return await this.repository.findAll(options);
  }

  async findById(id: string): Promise<T | null> {
    return await this.repository.findById(id);
  }

  async findByProperty(property: string, value: any): Promise<T | null> {
    return await this.repository.findByProperty(property, value);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.repository.update(id, data);
  }

  async delete(id: string): Promise<T | null> {
    return await this.repository.delete(id);
  }
}
