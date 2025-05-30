import { Injectable } from '@nestjs/common';
import { ShiftRepository } from './shift.repository';

@Injectable()
export class ShiftService {
  constructor(private readonly shiftRepository: ShiftRepository) {}

  async create(name: string) {
    return await this.shiftRepository.create(name);
  }

  async findAll() {
    return await this.shiftRepository.findAll();
  }

  async findById(id: string) {
    return await this.shiftRepository.findById(id);
  }

  async update(id: string, name: string) {
    return await this.shiftRepository.update(id, name);
  }

  async delete(id: string) {
    return await this.shiftRepository.delete(id);
  }
}
