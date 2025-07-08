import { Document } from 'mongoose';
import { BaseRepository } from './base.repository';
import { PaginationOptions } from './pagination-options';
import { Request } from 'express';

export class BaseService<T extends Document> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await this.repository.create(data);
  }

  async findAll(options: PaginationOptions = {}, secureOrRequest: boolean | Request = true) {
    // Check if second parameter is a Request object
    if (typeof secureOrRequest === 'object' && secureOrRequest.query) {
      const req = secureOrRequest as Request;
      const secure = true; // Default to secure when request is provided
      
      // Extract pagination parameters from request
      const page = parseInt(req.query.page as string) || options.page || 1;
      const limit = parseInt(req.query.limit as string) || options.limit || 10;
      const search = req.query.search as string || options.search;
      const sort = (req.query.sort as 'asc' | 'desc') || options.sort;
      const sortBy = req.query.sortBy as string || options.sortBy;
      
      // Build filter from request query parameters
      const filterObj = this.buildFilterFromRequest(req);
      
      const enhancedOptions: PaginationOptions = {
        page,
        limit,
        search,
        sort,
        sortBy,
        filter: { ...options.filter, ...filterObj }
      };
      
      return await this.repository.findAll(enhancedOptions, secure);
    } else {
      // Legacy behavior: second parameter is boolean secure flag
      const secure = secureOrRequest as boolean;
      return await this.repository.findAll(options, secure);
    }
  }

  private buildFilterFromRequest(req: Request): any {
    const reservedParams = ['page', 'limit', 'search', 'sort', 'sortBy'];
    const filterObj: any = {};
    
    // Helper function to set nested object value
    const setNestedValue = (obj: any, path: string, value: any) => {
      const keys = path.split('.');
      let current = obj;
      
      // Navigate to the parent object
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
      
      // Set the final value
      current[keys[keys.length - 1]] = value;
    };
    
    // Get all query parameters except reserved ones
    Object.keys(req.query).forEach(key => {
      if (!reservedParams.includes(key)) {
        let value = req.query[key] as string;
        
        // Type conversion for common data types
        if (value === 'true') value = true as any;
        else if (value === 'false') value = false as any;
        else if (value === 'null') value = null as any;
        else if (value === 'undefined') value = undefined as any;
        else if (!isNaN(Number(value)) && !isNaN(parseFloat(value))) {
          value = Number(value) as any;
        }
        
        // Handle any level of nested object notation (e.g., user.profile.address.city)
        if (key.includes('.')) {
          setNestedValue(filterObj, key, value);
        } else {
          filterObj[key] = value;
        }
      }
    });
    
    return filterObj;
  }

  async findById(id: string, secure = true): Promise<T | null> {
    return await this.repository.findById(id, secure);
  }

  async findByProperty(
    property: string,
    value: any,
    secure = true,
  ): Promise<T | null> {
    return await this.repository.findByProperty(property, value, secure);
  }

  async update(id: string, data: Partial<T>, secure = true): Promise<T | null> {
    return await this.repository.update(id, data, secure);
  }

  async delete(id: string, secure = true): Promise<T | null> {
    return await this.repository.delete(id, secure);
  }
}
