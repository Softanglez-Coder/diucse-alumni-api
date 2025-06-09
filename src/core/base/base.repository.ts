import { BadRequestException } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { PaginationOptions } from './pagination-options';

export class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const createdDocument = new this.model(data);
    return await createdDocument.save();
  }

  async findAll(options: PaginationOptions = {}): Promise<T[]> {
    const { page = 1, limit = 10, search, sort, sortBy, filter } = options;

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (filter) {
      Object.assign(query, filter);
    }

    return this.model
      .find(query)
      .sort(sortBy ? { [sortBy]: sort === 'asc' ? 1 : -1 } : {})
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findById(id: string): Promise<T | null> {
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    return await this.model.findById(id).exec();
  }

  async findByProperty(property: string, value: any): Promise<T | null> {
    if (!property || value === undefined) {
      throw new BadRequestException('Property and value are required');
    }

    const query: Record<string, any> = {};

    query[property] = value;

    const document = await this.model.findOne(query).exec();
    return document;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    const updatedDocument = await this.model
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updatedDocument) {
      throw new BadRequestException('Document not found');
    }

    return updatedDocument;
  }

  async delete(id: string): Promise<T | null> {
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    const deletedDocument = await this.model.findByIdAndDelete(id).exec();
    if (!deletedDocument) {
      throw new BadRequestException('Document not found');
    }

    return deletedDocument;
  }
}
