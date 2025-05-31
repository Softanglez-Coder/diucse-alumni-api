import { Injectable, Logger } from "@nestjs/common";
import { TokenRepository } from "./token.repository";

@Injectable()
export class TokenService {
    constructor(
        private readonly tokenRepository: TokenRepository,
        private readonly logger: Logger
    ) {}

    async store(username: string, token: string) {
        this.logger.log(`Storing token for user: ${username}`);
        return await this.tokenRepository.store(username, token);
    }

    async findByToken(token: string) {
        this.logger.log(`Finding token: ${token}`);
        return await this.tokenRepository.findByToken(token);
    }

    async invalidate(token: string) {
        this.logger.log(`Invalidating token: ${token}`);
        return await this.tokenRepository.invalidate(token);
    }

    async findByUsername(username: string) {
        this.logger.log(`Finding tokens for user: ${username}`);
        return await this.tokenRepository.findByUsername(username);
    }

    async invalidateByUsername(username: string) {
        this.logger.log(`Invalidating tokens for user: ${username}`);
        return await this.tokenRepository.invalidateByUsername(username);
    }

    async invalidateAll() {
        this.logger.log("Invalidating all tokens");
        return await this.tokenRepository.invalidateAll();
    }

    async isTokenValid(token: string): Promise<boolean> {
        this.logger.log(`Checking if token is valid: ${token}`);
        const foundToken = await this.tokenRepository.findByToken(token);
        return !!foundToken;
    }
}