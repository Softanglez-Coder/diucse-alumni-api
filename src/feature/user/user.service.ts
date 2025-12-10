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

  async generateMembershipId(): Promise<string> {
    this.logger.log('Generating new membership ID');

    // Find the latest user with a membership ID
    const latestMember = await this.userRepository
      .getModel()
      .findOne({ membershipId: { $exists: true, $ne: null } })
      .sort({ membershipId: -1 })
      .exec();

    let sequence = 1;

    if (latestMember && latestMember.membershipId) {
      // Extract the numeric part from the membership ID (e.g., "M000001" -> 1)
      const match = latestMember.membershipId.match(/^M(\d+)$/);
      if (match) {
        sequence = parseInt(match[1], 10) + 1;
      }
    }

    // Generate the new membership ID with leading zeros (e.g., "M000001")
    const membershipId = `M${sequence.toString().padStart(6, '0')}`;
    this.logger.log(`Generated membership ID: ${membershipId}`);

    return membershipId;
  }

  async findByMembershipId(membershipId: string): Promise<UserDocument | null> {
    this.logger.log(`Finding user by membership ID: ${membershipId}`);
    
    const user = await this.userRepository
      .getModel()
      .findOne({ membershipId })
      .exec();

    if (!user) {
      this.logger.warn(`No user found with membership ID: ${membershipId}`);
      return null;
    }

    return user;
  }

  async assignMembershipId(userId: string): Promise<UserDocument> {
    this.logger.log(`Assigning membership ID to user ${userId}`);

    const user = await this.findById(userId);
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new BadRequestException(`User with ID ${userId} not found`);
    }

    if (user.membershipId) {
      this.logger.warn(
        `User ${userId} already has membership ID: ${user.membershipId}`,
      );
      return user;
    }

    const membershipId = await this.generateMembershipId();
    user.membershipId = membershipId;

    const updatedUser = await this.update(userId, user);
    this.logger.log(
      `Membership ID ${membershipId} assigned to user ${userId}`,
    );

    return updatedUser;
  }
}
