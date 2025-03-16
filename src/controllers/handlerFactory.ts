import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

export const deleteAll = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response) => {
    await Model.deleteMany();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const deleteOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = (Model: Model<any>) =>
  catchAsync(
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    }
  );

export const createOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response) => {
    const newDoc = await Model.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });

export const getOne = (Model: Model<any>, populateOptions?: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line prefer-const
    let query = Model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const getAll = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response) => {
    let filter = {};
    if (req.params.id) filter = { tour: req.params.id };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });
