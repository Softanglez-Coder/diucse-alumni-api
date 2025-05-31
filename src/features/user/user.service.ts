import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, NotImplementedException } from "@nestjs/common";
import { UserEntity } from "./user.entity";
import { UserRepository } from "./user.repository";
import { isEmail } from "class-validator";
import { CreateUserRequest } from "./requests";
import { CreateUserResponse } from "./responses";
import * as bcrypt from "bcrypt";
import { Role } from "@core";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async create(payload: CreateUserRequest, roles: Role[] = [ Role.Guest ]): Promise<CreateUserResponse> {
        if (!payload.email) {
            throw new BadRequestException("Email is not provided");
        }

        if (false === isEmail(payload.email)) {
            throw new BadRequestException("Invalid email format");
        }

        if (!payload.username) {
            throw new BadRequestException("Username is not provided");
        }

        if (!payload.name) {
            throw new BadRequestException("Name is not provided");
        }

        if (!payload.password) {
            throw new BadRequestException("Password is not provided");
        }

        const emailExists = await this.userRepository.findByEmail(payload.email);
        if (emailExists) {
            throw new ConflictException(`User with email ${payload.email} already exists`);
        }

        const usernameExists = await this.userRepository.findByUsername(payload.username);
        if (usernameExists) {
            throw new ConflictException(`User with username ${payload.username} already exists`);
        }

        const hashed = await bcrypt.hash(payload.password, 10);

        const user = await this.userRepository.create({
            email: payload.email,
            username: payload.username,
            name: payload.name,
            hash: hashed,
            isEmailVerified: false,
            isActive: true,
            roles: roles,
        });

        if (!user) {
            throw new InternalServerErrorException("User could not be created");
        }

        const response: CreateUserResponse = {
            id: user._id.toString(),
            name: user.name,
            username: user.username,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            isActive: user.isActive,
            roles: user.roles || [],
        };

        return response;
    }
    
    async findById(id: string, secure: boolean = true): Promise<UserEntity> {
        if (!id) {
            throw new BadRequestException("User ID is not provided");
        }

        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const response: UserEntity = {
            id: user._id.toString(),
            username: user.username,
            name: user.name,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            hash: user.hash,
            isActive: user.isActive,
            roles: user.roles || [],
        }

        if (secure) {
            delete response.hash; // Remove sensitive information
        }

        return response;
    }

    async findByEmail(email: string, secure: boolean = true): Promise<UserEntity> {
        if (!email) {
            throw new BadRequestException("Email is not provided");
        }

        if (false === isEmail(email)) {
            throw new BadRequestException("Invalid email format");
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        const response: UserEntity = {
            id: user._id.toString(),
            username: user.username,
            name: user.name,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            hash: user.hash,
            isActive: user.isActive,
            roles: user.roles || [],
        }

        if (secure) {
            delete response.hash; // Remove sensitive information
        }

        return response;
    }

    async findByUsername(username: string, secure: boolean = true): Promise<UserEntity> {
        if (!username) {
            throw new BadRequestException("Username is not provided");
        }

        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }

        const response: UserEntity = {
            id: user._id.toString(),
            username: user.username,
            name: user.name,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            hash: user.hash,
            isActive: user.isActive,
            roles: user.roles || [],
        }

        if (secure) {
            delete response.hash; // Remove sensitive information
        }

        return response;
    }

    async update(id: string, payload: Partial<CreateUserRequest>): Promise<UserEntity> {
        if (!id) {
            throw new BadRequestException("User ID is not provided");
        }

        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        if (payload.email && false === isEmail(payload.email)) {
            throw new BadRequestException("Invalid email format");
        }

        if (payload.email) {
            const emailExists = await this.userRepository.findByEmail(payload.email);
            if (emailExists && emailExists._id.toString() !== id) {
                throw new ConflictException(`User with email ${payload.email} already exists`);
            }
        }

        if (payload.username) {
            const usernameExists = await this.userRepository.findByUsername(payload.username);
            if (usernameExists && usernameExists._id.toString() !== id) {
                throw new ConflictException(`User with username ${payload.username} already exists`);
            }
        }

        Object.assign(user, payload);

        const updatedUser = await this.userRepository.update(user.id, user);
        if (!updatedUser) {
            throw new InternalServerErrorException("User could not be updated");
        }

        const response: UserEntity = {
            id: updatedUser._id.toString(),
            username: updatedUser.username,
            name: updatedUser.name,
            email: updatedUser.email,
            isEmailVerified: updatedUser.isEmailVerified,
            hash: updatedUser.hash,
            isActive: updatedUser.isActive,
            roles: updatedUser.roles || [],
        };

        return response;
    }

    async createBotAccount(email: string, password: string): Promise<CreateUserResponse> {
        const payload: CreateUserRequest = {
            email: email,
            username: `bot`,
            name: `Bot User`,
            password: password,
        }

        const roles: Role[] = [ Role.SuperAdmin ];
        const user = await this.create(payload, roles);
        if (!user) {
            throw new InternalServerErrorException("Bot account could not be created");
        }

        const response: CreateUserResponse = {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            isActive: user.isActive,
            roles: user.roles,
        };

        return response;
    }
}