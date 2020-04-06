import { gql, ApolloServer } from 'apollo-server-lambda';
import { buildFederatedSchema } from '@apollo/federation';
import { GraphQLResolverMap } from 'apollo-graphql';
import { ProductAPI } from '@test/product-api';

const typeDefs = gql`
  extend type Query {
    product(id: Int!): Product
    products: [Product!]!
  }

  type Product @key(fields: "id") {
    id: Int!
    name: String!
  }
`;

const resolvers: GraphQLResolverMap<{
    dataSources: {
        productAPI: ProductAPI
    }
}> = {
  Query: {
    product(_root: any, { id }, { dataSources: { productAPI } }) {
      return productAPI.getProduct(id);
    },
    products(_root: any, _args, { dataSources: { productAPI } }) {
      return productAPI.getProducts();
    },
  },
  Product: {
    __resolveReference({ id }, { dataSources: { productAPI } }) {
        return productAPI.getProduct(id);
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
    productAPI: new ProductAPI(),
  }),
});

exports.handler = server.createHandler();
