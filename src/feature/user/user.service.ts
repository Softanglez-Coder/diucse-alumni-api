import { BaseService, Role } from '@core';
import {
  BadRequestException,
  Injectable,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { UserRepository } from './user.repository';
import { CommitteeDesignationService } from '../committee-designation/committee-designation.service';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => CommitteeDesignationService))
    private readonly committeeDesignationService: CommitteeDesignationService,
  ) {
    super(userRepository);
  }

  async findByRole(role: Role): Promise<User[]> {
    if (!Object.values(Role).includes(role)) {
      this.logger.error(`Invalid role: ${role}`);
      throw new BadRequestException(`Invalid role: ${role}`);
    }

    const members = await this.userRepository.getModel().find({
      roles: { $in: [role] },
    });

    return members;
  }

  async findByIdWithAllRoles(userId: string): Promise<any> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    try {
      // Get designation roles for the user
      const designationRoles =
        await this.committeeDesignationService.getUserActiveRoles(userId);

      // Combine user's static roles with designation roles
      const allRoles = [
        ...new Set([...(user.roles || []), ...designationRoles]),
      ];

      return {
        ...user.toObject(),
        roles: allRoles,
        staticRoles: user.roles || [],
        designationRoles,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching designation roles for user ${userId}:`,
        error.message,
      );
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
            const designationRoles =
              await this.committeeDesignationService.getUserActiveRoles(
                user._id.toString(),
              );
            const allRoles = [
              ...new Set([...(user.roles || []), ...designationRoles]),
            ];

            return {
              ...user.toObject(),
              roles: allRoles,
              staticRoles: user.roles || [],
              designationRoles,
            };
          } catch (error) {
            this.logger.error(
              `Error fetching designation roles for user ${user._id}:`,
              error.message,
            );
            return {
              ...user.toObject(),
              staticRoles: user.roles || [],
              designationRoles: [],
            };
          }
        }),
      );

      return usersWithRoles;
    } catch (error) {
      this.logger.error('Error fetching users with roles:', error.message);
      // Fallback to regular users if service fails
      const users = await this.repository.findAll({});
      return users.map((user) => ({
        ...user.toObject(),
        staticRoles: user.roles || [],
        designationRoles: [],
      }));
    }
  }
}
