import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';
export const deleteAll = (Model) => catchAsync(async (req, res) => {
    await Model.deleteMany();
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
export const deleteOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError('No document found with that id', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
export const updateOne = (Model) => catchAsync(async (req, res, next) => {
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
});
export const createOne = (Model) => catchAsync(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(200).json({
        status: 'success',
        data: {
            data: newDoc,
        },
    });
});
export const getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions)
        query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
        return next(new AppError('No document found with that id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: doc,
    });
});
export const getAll = (Model) => catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.id)
        filter = { tour: req.params.id };
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
