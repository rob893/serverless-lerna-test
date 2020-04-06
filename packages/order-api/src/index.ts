import { RESTDataSource } from "apollo-datasource-rest";

const orders = [
  {
    id: 1,
    customerId: 1,
    productId: 1,
  },
  {
    id: 2,
    customerId: 1,
    productId: 1,
  },
  {
    id: 3,
    customerId: 2,
    productId: 3,
  },
  {
    id: 4,
    customerId: 1,
    productId: 4,
  },
];

export class OrderAPI extends RESTDataSource {
  constructor() {
    super();
  }

  getOrders() {
    return orders;
  }

  getOrder(id: number) {
    return orders.find((o) => o.id === id);
  }
}
