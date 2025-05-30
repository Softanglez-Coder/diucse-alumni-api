export class Query {
  sort: string = '';
  limit: number = 10;
  skip: number = 0;
  search: string = '';

  select: string[] = [];

  populate?: string[] = [];
}
