import { Document } from 'mongoose';
import { BaseRepository } from './base.repository';
import { PaginationOptions } from './pagination-options';

export class BaseService<T extends Document> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await this.repository.create(data);
  }

  async findAll(options: PaginationOptions = {}, secure = true) {
    return await this.repository.findAll(options, secure);
  }

  async findById(id: string, secure = true): Promise<T | null> {
    return await this.repository.findById(id, secure);
  }

  async findByProperty(
    property: string,
    value: any,
    secure = true,
  ): Promise<T | null> {
    return await this.repository.findByProperty(property, value, secure);
  }

  async update(id: string, data: Partial<T>, secure = true): Promise<T | null> {
    return await this.repository.update(id, data, secure);
  }

  async delete(id: string, secure = true): Promise<T | null> {
    return await this.repository.delete(id, secure);
  }
}
