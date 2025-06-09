import { ConflictException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { User, UserService } from '../user';
import { LoginDto, RegisterDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly logger: Logger,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) {}

    async register(payload: RegisterDto) {
        this.logger.log(`Attempting to register user with email: ${payload.email}`);

        const existingUser = await this.userService.findByProperty('email', payload.email);
        if (existingUser) {
            this.logger.warn(`Registration failed: User already exists with email: ${payload.email}`);
            throw new ConflictException('User already exists with this email');
        }

        const hash = bcrypt.hashSync(payload.password, 10);

        const user: User = {
            email: payload.email,
            password: hash,
            name: payload.name,
        };

        this.logger.log(`Registering user with email: ${user.email}`);

        const createdUser = await this.userService.create(user);
        this.logger.log(`User created with ID: ${createdUser.id}`);

        if (!createdUser) {
            this.logger.error(`Failed to create user with email: ${user.email}`);
            throw new InternalServerErrorException('User registration failed');
        }

        this.logger.log(`User registration successful for email: ${user.email}`);
        
        const loggedIn = await this.login({ email: user.email, password: payload.password });
        this.logger.log(`JWT token generated for user with email: ${user.email}`);

        return loggedIn;
    }

    async login(payload: LoginDto) {
        this.logger.log(`Attempting to log in user with email: ${payload.email}`);

        const user = await this.userService.findByProperty('email', payload.email, false);
        if (!user) {
            this.logger.warn(`Login failed: User not found for email: ${payload.email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = bcrypt.compareSync(
            payload.password,
            user.password,
        );

        if (!isPasswordValid) {
            this.logger.warn(`Login failed: Invalid password for email: ${payload.email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        this.logger.log(`User logged in successfully with email: ${payload.email}`);

        const token = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            roles: user.roles || [],
        }, {
            expiresIn: '7d',
            secret: this.config.get<string>('JWT_SECRET'),
        });

        this.logger.log(`JWT token generated for user with email: ${payload.email}`);

        return { accessToken: token };
    }
}
