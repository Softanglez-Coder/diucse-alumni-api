export interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'asc' | 'desc';
  sortBy?: string;
  filter?: Record<string, any>;
}
