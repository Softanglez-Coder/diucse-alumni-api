import { BaseService } from '@core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BlogDocument } from './blog.schema';
import { BlogRepository } from './blog.repository';

@Injectable()
export class BlogService extends BaseService<BlogDocument> {
    constructor(
        private readonly blogRepository: BlogRepository,
        private readonly logger: Logger
    ) {
        super(blogRepository);
    }

    async publish(id: string): Promise<BlogDocument> {
        this.logger.log(`Publishing blog with id: ${id}`);
        
        const blog = await this.blogRepository.findById(id);
        if (!blog) {
            this.logger.error(`Blog with id ${id} not found`);
            throw new NotFoundException(`Blog with id ${id} not found`);
        }

        blog.published = true;
        
        return await this.blogRepository.update(id, blog);
    }

    async unpublish(id: string): Promise<BlogDocument> {
        this.logger.log(`Unpublishing blog with id: ${id}`);
        
        const blog = await this.blogRepository.findById(id);
        if (!blog) {
            this.logger.error(`Blog with id ${id} not found`);
            throw new NotFoundException(`Blog with id ${id} not found`);
        }

        blog.published = false;
        
        return await this.blogRepository.update(id, blog);
    }
}
