import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { AppError } from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { bikeService } from './bike.service';

const createBike = catchAsync(async (req, res) => {
  // take the given json data from request as payload
  const payload = req.body;
  const result = await bikeService.createBike(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Bike created successfully',
    data: result,
  });
});

const getAllBikes = catchAsync(async (req, res) => {
  const searchTerm = req.query.searchTerm as string;
  const brand = req.query.brand as string;
  const minPrice =
    typeof req.query.minPrice === 'string' ? Number(req.query.minPrice) : 0;
  const maxPrice =
    typeof req.query.maxPrice === 'string' ? Number(req.query.maxPrice) : 0;

  const availability = req.query.availability === 'true';
  const result = await bikeService.getBikes(
    searchTerm,
    minPrice,
    maxPrice,
    availability,
    brand,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bikes retrieved successfully',
    data: result,
  });
});

const getSingleBike = catchAsync(async (req, res) => {
  // get the _id of bike in params to retrieve the correct bike
  const productId = req.params.productId;
  // check if the productId is valid _id from bikes collection
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID');
  }

  const result = await bikeService.getSingleBike(productId);

  if (result === null) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike retrieved successfully',
    data: result,
  });
});

// const getSingleBike = async (req: Request, res: Response) => {
//   try {
//     // get the _id of bike in params to retrieve the correct bike
//     const productId = req.params.productId;
//     // check if the productId is valid _id from bikes collection
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(404).json({
//         success: false,
//         message: 'Invalid product ID',
//       });
//     }
//     const result = await bikeService.getSingleBike(productId);

//     if (result === null) {
//       throw new Error('Invalid Input');
//     }
//     res.status(200).send({
//       message: 'Bike retrieved successfully',
//       status: true,
//       data: result,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error._message,
//       success: false,
//       error: { name: error.name, errors: error.errors },
//       stack: error instanceof Error ? error.stack : null,
//     });
//   }
// };

const updateBike = catchAsync(async (req, res) => {
  // get the productId in parmas
  const productId = req.params.productId;
  // take the json body of bike details from response and send it to update function
  const body = req.body;
  const result = await bikeService.updateBike(productId, body);

  // console.log('here', req.user, req.params);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike updated successfully',
    data: result,
  });
});

// const updateBike = async (req: Request, res: Response) => {
//   try {
//     // get the productId in parmas
//     const productId = req.params.productId;
//     // take the json body of bike details from response and send it to update function
//     const body = req.body;
//     const result = await bikeService.updateBike(productId, body);

//     res.send({
//       message: 'Bike updated successfully',
//       status: true,
//       data: result,
//     });
//   } catch (error: any) {
//     if (error.name === 'CastError') {
//       res.status(500).json({
//         message: `Invalid input for ${error.path}: ${error.value}`,
//         success: false,
//       });
//     }
//     res.status(500).json({
//       message: error._message,
//       success: false,
//       error: { name: error.name, errors: error.errors },
//       stack: error instanceof Error ? error.stack : null,
//     });
//   }
// };

const deleteBike = catchAsync(async (req, res) => {
  // get the productId from params and send it to delete function
  const productId = req.params.productId;
  // check if the productId is valid _id from bikes collection
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid product ID');
  }
  await bikeService.deleteBike(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike deleted successfully',
    data: null,
  });
});

// const deleteBike = async (req: Request, res: Response) => {
//   try {
//     // get the productId from params and send it to delete function
//     const productId = req.params.productId;
//     // check if the productId is valid _id from bikes collection
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(404).json({
//         success: false,
//         message: 'Invalid product ID',
//       });
//     }

//     await bikeService.deleteBike(productId);
//     res.send({
//       message: 'Bike deleted successfully',
//       status: true,
//       data: {},
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error._message,
//       success: false,
//       error: { name: error.name, errors: error.errors },
//       stack: error instanceof Error ? error.stack : null,
//     });
//   }
// };

export const bikeController = {
  createBike,
  getAllBikes,
  getSingleBike,
  updateBike,
  deleteBike,
};
