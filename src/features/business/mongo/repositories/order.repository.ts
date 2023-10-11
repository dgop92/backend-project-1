import { AppLogger } from "@common/logging/logger";
import { SLPaginationResult } from "@common/types/common-types";
import { Collection, ObjectId } from "mongodb";
import {
  IOrderRepository,
  OrderCreateRepoData,
  OrderUpdateRepoData,
  OrderUpdateStatusRepoData,
} from "@features/business/ports/order.repository.definition";
import { OrderDocument } from "../models/order.document";
import { Order } from "@features/business/entities/order";
import { IProductRepository } from "@features/business/ports/product.repository.definition";
import { ErrorCode, RepositoryError } from "@common/errors";
import { OrderItem, OrderSearchInput } from "@features/business/schema-types";

const myLogger = AppLogger.getAppLogger().createFileLogger(__filename);

export class OrderRepository implements IOrderRepository {
  private productRepository: IProductRepository;

  constructor(private readonly collection: Collection<OrderDocument>) {}

  setDependencies(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  private async getProducts(orderItems: OrderItem[]) {
    const productIds = orderItems.map((item) => item.productId);
    const quantities = orderItems.map((item) => item.quantity);

    const products = await this.productRepository.getManyBy({
      searchBy: {
        ids: productIds,
      },
    });

    if (products.count !== productIds.length) {
      throw new RepositoryError(
        "some products were not found. Please check your order items.",
        ErrorCode.INVALID_ID
      );
    }

    if (products.count === 0) {
      throw new RepositoryError(
        "no products were found. Please check your order items.",
        ErrorCode.INVALID_ID
      );
    }

    const items = products.results.map((product, index) => {
      const quantity = quantities[index];
      return {
        product,
        quantity,
      };
    });

    return items;
  }

  async create(input: OrderCreateRepoData): Promise<Order> {
    myLogger.debug("creating order", { input });
    const items = await this.getProducts(input.items);

    const total = items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    const data: OrderDocument = {
      items,
      total,
      status: "created",
      // at least one item is guaranteed to exist
      restaurantId: new ObjectId(items[0].product.restaurantId),
      appUserId: new ObjectId(input.appUserId),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const result = await this.collection.insertOne(data);
    myLogger.debug("order created", {
      id: result.insertedId.toHexString(),
    });

    return {
      ...data,
      id: result.insertedId.toHexString(),
      restaurantId: data.restaurantId.toHexString(),
      appUserId: data.appUserId.toHexString(),
    };
  }

  async update(order: Order, input: OrderUpdateRepoData): Promise<Order> {
    myLogger.debug("updating order", {
      id: order.id,
      ...input,
    });

    // deep copy
    const newOrder: Order = JSON.parse(JSON.stringify(order));
    const itemsToAdd = input.itemsToAdd ?? [];

    const uniqueOrderItemsToAdd = itemsToAdd.filter((item) => {
      return !newOrder.items.some((orderItem) => {
        return orderItem.product.id === item.productId;
      });
    });

    if (itemsToAdd.length > 0) {
      const items = await this.getProducts(uniqueOrderItemsToAdd);
      newOrder.items.push(...items);
    }

    const productsToRemove = input.productsToRemove ?? [];

    if (productsToRemove.length > 0) {
      newOrder.items = newOrder.items.filter((item) => {
        return !productsToRemove.includes(item.product.id);
      });
    }

    const itemsToUpdate = input.itemsToUpdate ?? [];

    if (itemsToUpdate.length > 0) {
      itemsToUpdate.forEach((item) => {
        const index = newOrder.items.findIndex((orderItem) => {
          return orderItem.product.id === item.productId;
        });

        if (index === -1) {
          throw new RepositoryError(
            "some products were not found. Please check your order items.",
            ErrorCode.INVALID_ID
          );
        }

        newOrder.items[index].quantity = item.quantity;
      });
    }

    const newTotal = newOrder.items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    newOrder.total = newTotal;

    const updateDoc = {
      $set: {
        items: newOrder.items,
        total: newTotal,
        updatedAt: new Date(),
      },
    };
    await this.collection.updateOne({ _id: new ObjectId(order.id) }, updateDoc);
    myLogger.debug("order updated", { id: order.id });
    return newOrder;
  }

  async updateStatus(
    order: Order,
    input: OrderUpdateStatusRepoData
  ): Promise<Order> {
    myLogger.debug("updateing status of order", {
      id: order.id,
      status: input.status,
    });
    // soft delete
    await this.collection.updateOne(
      { _id: new ObjectId(order.id) },
      {
        $set: {
          status: input.status,
          updatedAt: new Date(),
        },
      }
    );

    myLogger.debug("order status updated", { id: order.id });
    return {
      ...order,
      status: input.status,
    };
  }

  async delete(order: Order): Promise<void> {
    myLogger.debug("deleting order", { id: order.id });
    // soft delete
    await this.collection.updateOne(
      { _id: new ObjectId(order.id) },
      {
        $set: {
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
      }
    );
    myLogger.debug("order deleted", { id: order.id });
  }

  async getOneBy(input: OrderSearchInput): Promise<Order | undefined> {
    myLogger.debug("getting one order by", { input });
    const query = this.getQuery(input);

    const result = await this.collection.findOne(query);

    if (result === null) {
      myLogger.debug("order not found");
      return undefined;
    }

    const { _id, ...rest } = result ?? {};
    myLogger.debug("order found", { id: _id.toHexString() });
    return {
      ...rest,
      id: _id.toHexString(),
      appUserId: rest.appUserId.toHexString(),
      restaurantId: rest.restaurantId.toHexString(),
    };
  }

  async getManyBy(input: OrderSearchInput): Promise<SLPaginationResult<Order>> {
    myLogger.debug("getting many Orders by", { input });
    const query = this.getQuery(input);
    const cursor = this.collection.find(query);

    const documents = await cursor.toArray();
    const totalCount = documents.length;
    const orders = documents.map((document) => {
      const { _id, ...rest } = document;
      return {
        ...rest,
        id: _id.toHexString(),
        restaurantId: rest.restaurantId.toHexString(),
        appUserId: rest.appUserId.toHexString(),
      };
    });

    return {
      count: totalCount,
      results: orders,
    };
  }

  private getQuery(searchQuery: OrderSearchInput) {
    const query: { [key: string]: any } = {};
    const { searchBy, filterBy } = searchQuery;

    if (searchBy?.id) {
      query["_id"] = new ObjectId(searchBy.id);
    }

    if (searchBy?.restaurantId) {
      query["restaurantId"] = new ObjectId(searchBy.restaurantId);
    }

    if (searchBy?.appUserId) {
      query["appUserId"] = new ObjectId(searchBy.appUserId);
    }

    if (filterBy?.status) {
      query["status"] = filterBy.status;
    }

    // retrieve only non-deleted orders
    query["deletedAt"] = null;

    return query;
  }
}
