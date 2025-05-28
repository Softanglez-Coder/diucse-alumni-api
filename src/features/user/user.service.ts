import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(email: string, password: string) {
    const hashedPassword = await this.hashPassword(password);
    return await this.userRepository.create(email, hashedPassword);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByUsername(email);
  }

  async findById(id: string) {
    return await this.userRepository.findById(id);
  }

  async updatePassword(id: string, newPassword: string) {
    const hashedPassword = await this.hashPassword(newPassword);
    return await this.userRepository.updatePassword(id, hashedPassword);
  }

  async deleteById(id: string) {
    return await this.userRepository.deleteById(id);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async exists(email: string): Promise<boolean> {
    return await this.userRepository.exists(email);
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findByUsername(email);

    if (!user) {
      return false;
    }

    return await this.comparePasswords(password, user.hash);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
