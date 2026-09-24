import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IRepository<T extends Document> {
  findById(id: string): Promise<T | null>;
  findMany(filter?: Record<string, unknown>): Promise<T[]>;
  findOne(filter: Record<string, unknown>): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: Record<string, unknown>): Promise<number>;
}

export function createBaseRepository<T extends Document>(model: Model<T>): IRepository<T> {
  return {
    async findById(id: string): Promise<T | null> {
      return model.findById(id).lean() as Promise<T | null>;
    },

    async findMany(filter: Record<string, unknown> = {}): Promise<T[]> {
      return model.find(filter).lean() as Promise<T[]>;
    },

    async findOne(filter: Record<string, unknown>): Promise<T | null> {
      return model.findOne(filter).lean() as Promise<T | null>;
    },

    async create(data: Partial<T>): Promise<T> {
      const doc = await model.create(data);
      return doc.toObject() as T;
    },

    async update(id: string, data: Partial<T>): Promise<T | null> {
      const doc = await model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
      return doc as T | null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await model.findByIdAndDelete(id);
      return result !== null;
    },

    async count(filter: Record<string, unknown> = {}): Promise<number> {
      return model.countDocuments(filter).lean() as Promise<number>;
    },
  };
}
