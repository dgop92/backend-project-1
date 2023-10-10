/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface ProductCreateInput {
  data: {
    category: string;
    description: string;
    name: string;
    price: number;
  };
}

export interface ProductSearchInput {
  searchBy?: {
    category?: string;
    id?: string;
    restaurantId?: string;
  };
}

export interface ProductUpdateInput {
  data: {
    category?: string;
    description?: string;
    name?: string;
    price?: number;
  };
  searchBy: {
    id: string;
  };
}