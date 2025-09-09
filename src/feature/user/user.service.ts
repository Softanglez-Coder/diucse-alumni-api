import { BaseService, Role } from '@core';
import { BadRequestException, Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './user.schema';
import { UserRepository } from './user.repository';
import { CommitteeDesignationService } from '../committee-designation/committee-designation.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => CommitteeDesignationService))
    private readonly committeeDesignationService: CommitteeDesignationService,
  ) {
    super(userRepository);
    this.createBot();
  }

  async findByRole(role: Role): Promise<User[]> {
    if (!Object.values(Role).includes(role)) {
      this.logger.error(`Invalid role: ${role}`);
      throw new BadRequestException(`Invalid role: ${role}`);
    }

    const members = await this.userRepository.getModel().find({
      roles: { $in: [role] },
      email: { $ne: process.env.BOT_EMAIL },
    });

    return members;
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

  async findByIdWithAllRoles(userId: string): Promise<any> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    try {
      // Get designation roles for the user
      const designationRoles = await this.committeeDesignationService.getUserActiveRoles(userId);
      
      // Combine user's static roles with designation roles
      const allRoles = [...new Set([...(user.roles || []), ...designationRoles])];
      
      return {
        ...user.toObject(),
        roles: allRoles,
        staticRoles: user.roles || [],
        designationRoles,
      };
    } catch (error) {
      this.logger.error(`Error fetching designation roles for user ${userId}:`, error.message);
      // Return user with static roles if designation service fails
      return {
        ...user.toObject(),
        staticRoles: user.roles || [],
        designationRoles: [],
      };
    }
  }

  async findAllWithRoles(): Promise<any[]> {
    try {
      const users = await this.repository.findAll({});
      const usersWithRoles = await Promise.all(
        users.map(async (user) => {
          try {
            const designationRoles = await this.committeeDesignationService.getUserActiveRoles(user._id.toString());
            const allRoles = [...new Set([...(user.roles || []), ...designationRoles])];
            
            return {
              ...user.toObject(),
              roles: allRoles,
              staticRoles: user.roles || [],
              designationRoles,
            };
          } catch (error) {
            this.logger.error(`Error fetching designation roles for user ${user._id}:`, error.message);
            return {
              ...user.toObject(),
              staticRoles: user.roles || [],
              designationRoles: [],
            };
          }
        })
      );
      
      return usersWithRoles;
    } catch (error) {
      this.logger.error('Error fetching users with roles:', error.message);
      // Fallback to regular users if service fails
      const users = await this.repository.findAll({});
      return users.map(user => ({
        ...user.toObject(),
        staticRoles: user.roles || [],
        designationRoles: [],
      }));
    }
  }
}
