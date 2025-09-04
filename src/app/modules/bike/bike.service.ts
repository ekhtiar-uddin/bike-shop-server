import { IBike } from './bike.interface';
import Bike from './bike.model';

const createBike = async (payload: IBike): Promise<IBike> => {
  const result = await Bike.create(payload);
  return result;
};

const getBikes = async (
  searchTerm: string,
  minPrice: number,
  maxPrice: number,
  availability: boolean,
  brand: string,
) => {
  // filter data accordingto searchTerm using $or method

  console.log('searchTerm', searchTerm);

  const searchQueryObj = searchTerm
    ? {
        $or: [
          { category: { $regex: searchTerm, $options: 'i' } },
          { brand: { $regex: searchTerm, $options: 'i' } },
          { name: { $regex: searchTerm, $options: 'i' } },
          { model: { $regex: searchTerm, $options: 'i' } },
        ],
      }
    : {};

  let searchQuery = Bike.find(searchQueryObj);

  console.log('brand', brand);
  if (brand) {
    searchQuery = searchQuery.find({ brand: { $regex: brand, $options: 'i' } });
  }

  if (availability) {
    const availabilityQueryQbj = {
      inStock: availability,
    };
    const availabilityQuery = await searchQuery.find(availabilityQueryQbj);
    return await availabilityQuery;
  }

  if (minPrice && maxPrice) {
    const priceQueryObj = { price: { $gte: minPrice, $lte: maxPrice } };

    const priceQuery = await searchQuery.find(priceQueryObj);

    return await priceQuery;
  }

  return await searchQuery;
};

const getSingleBike = async (id: string) => {
  //get the specific bike from bikes collection
  const result = await Bike.findById(id);
  return result;
};

const updateBike = async (id: string, data: IBike) => {
  // udpate a specific bike
  const result = await Bike.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

const deleteBike = async (id: string) => {
  // delete a specific bike
  const result = await Bike.findByIdAndDelete(id);
  return result;
};

export const bikeService = {
  createBike,
  getBikes,
  getSingleBike,
  updateBike,
  deleteBike,
};
