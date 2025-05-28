import { Model, Document } from 'mongoose';
import { Query } from './models';

export class BaseRepository<T extends Document> {
  constructor(private _model: Model<T>) {}

  async findAll(query: Query = new Query()): Promise<T[]> {
    const { search, sort, select, skip, limit } = query;

    let filter: Record<string, any> = {};

    // If filter is a string, build a $or filter for all string fields
    if (typeof search === 'string' && search.trim() !== '') {
      // Get schema paths (field names)
      const stringFields = Object.entries(this._model.schema.paths)
        .filter(([, v]: [string, any]) => v.instance === 'String')
        .map(([k]) => k);

      // Build $or filter
      filter = {
        $or: stringFields.map((field) => ({
          [field]: { $regex: search, $options: 'i' },
        })),
      };
    }

    return await this._model
      .find(filter)
      .sort(sort || 'createdAt -1')
      .select(select || '')
      .skip(+(skip || 0))
      .limit(+limit || 10)
      .populate(query.populate || [])
      .exec();
  }

  async findById(id: string, populate?: string[]): Promise<T | null> {
    return await this._model
      .findById(id)
      .populate(populate || [])
      .exec();
  }

  async create(dto: Partial<T>): Promise<T> {
    const document = new this._model(dto);
    return await document.save();
  }

  async update(id: string, dto: Partial<T>): Promise<T | null> {
    return await this._model.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return await this._model.findByIdAndDelete(id).exec();
  }

  async findByProperty<PV>(property: string, value: PV): Promise<T | null> {
    return await this._model
      .findOne({
        [property]: value,
      } as unknown as Record<string, PV>)
      .exec();
  }
}
