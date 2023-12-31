/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface RestaurantCreateInput {
  data: {
    address: string;
    category: string;
    name: string;
  };
}

export interface RestaurantSearchInput {
  searchBy?: {
    appUserId?: string;
    category?: string;
    id?: string;
    name?: string;
  };
}

export interface RestaurantUpdateInput {
  data: {
    address?: string;
    category?: string;
    name?: string;
  };
  searchBy: {
    id: string;
  };
}
