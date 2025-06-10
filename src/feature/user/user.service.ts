import { BaseService, Role } from '@core';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './user.schema';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {
    super(userRepository);
    this.createBot();
  }

  async createBot() {
    const email: string = this.config.get<string>('BOT_EMAIL');
    if (!email) {
      this.logger.warn(
        'BOT_EMAIL is not set in the configuration. Skipping bot creation.',
      );
      return;
    }

    const user = await this.findByProperty('email', email);
    if (user) {
      this.logger.warn(
        `Bot with email ${email} already exists. Skipping creation.`,
      );
      return;
    }

    const password: string = this.config.get<string>('BOT_PASSWORD');

    const hash = bcrypt.hashSync(password, 10);

    const bot: User = {
      email,
      password: hash,
      roles: Object.values(Role),
      name: 'Bot',
      active: true,
    };

    try {
      await this.userRepository.create(bot);
      this.logger.log(`Bot user with email ${email} created successfully.`);
    } catch (error) {
      this.logger.error(
        `Failed to create bot user with email ${email}:`,
        error,
      );
    }
  }
}
