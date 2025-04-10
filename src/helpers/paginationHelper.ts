import { TPaginationOptions, TPaginationReturn } from "../app/interfaces/pagination";

export const calculatePagination = (
  options: TPaginationOptions
): TPaginationReturn => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (page - 1) * limit;

  const sortBy: string = (options.sortBy as string) || 'createdAt';
  const sortOrder: 'asc' | 'desc' = options.sortOrder || 'desc';
  return { page, limit, skip, sortBy, sortOrder };
};

export const paginationFields = ['limit', 'page', 'sortBy', 'sortOrder'];

// export const paginationHelper = {
//   calculatePagination,
// };
