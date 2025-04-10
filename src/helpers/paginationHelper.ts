type TOptions = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

type TPagiReturn = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

export const calculatePagination = (options: TOptions): TPagiReturn => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (page - 1) * limit;

  const sortBy: string = (options.sortBy as string) || 'createdAt';
  const sortOrder: 'asc' | 'desc' = options.sortOrder || 'desc';
  return { page, limit, skip, sortBy, sortOrder };
};


export const paginationFields = ['limit', 'page', 'sortBy', 'sortOrder'];