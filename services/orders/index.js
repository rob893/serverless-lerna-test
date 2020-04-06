const { buildFederatedSchema } = require("@apollo/federation");
const { gql, ApolloServer } = require("apollo-server-lambda");
const { OrderAPI } = require("@test/order-api");

const typeDefs = gql`
  extend type Query {
    orders: [Order]
    order(id: Int!): Order
  }

  type Order {
    id: Int!
    customerId: Int!
    productId: Int!
    product: Product!
    customer: Customer!
  }

  extend type Product @key(fields: "id") {
    id: Int! @external
  }

  extend type Customer @key(fields: "id") {
    id: Int! @external
    orders: [Order]!
  }
`;

const resolvers = {
  Query: {
    orders(_parent, _args, { dataSources: { orderAPI } }) {
      return orderAPI.getOrders();
    },
    order(_parent, { id }, { dataSources: { orderAPI } }) {
      return orderAPI.getOrder(id);
    },
  },
  Order: {
    customer({ customerId }) {
      return { __typename: "Customer", id: customerId };
    },
    product({ productId }) {
      return { __typename: "Product", id: productId };
    },
  },
  Customer: {
    orders({ id }, _args, { dataSources: { orderAPI } }) {
      return orderAPI.getOrders().filter((o) => o.customerId === id);
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  dataSources: () => ({
    orderAPI: new OrderAPI(),
  }),
});

exports.handler = server.createHandler();
