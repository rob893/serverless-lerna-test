import { RESTDataSource } from "apollo-datasource-rest";

const products = [
  {
    id: 1,
    name: "desk",
  },
  {
    id: 2,
    name: "chair",
  },
  {
    id: 3,
    name: "tv",
  },
  {
    id: 4,
    name: "cup",
  },
];

export class ProductAPI extends RESTDataSource {
  constructor() {
    super();
  }

  getProducts() {
    return products;
  }

  getProduct(id: number) {
    return products.find((p) => p.id === id);
  }
}
