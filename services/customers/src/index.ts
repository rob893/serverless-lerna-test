import { gql, ApolloServer } from "apollo-server-lambda";
import { buildFederatedSchema } from "@apollo/federation";
import { GraphQLResolverMap } from "apollo-graphql";
// @ts-ignore
import { CustomerAPI } from "@test/customer-api";

const typeDefs = gql`
  extend type Query {
    customer(id: Int!): Customer
    customers: [Customer!]!
  }

  type Customer @key(fields: "id") {
    id: Int!
    firstName: String!
    lastName: String!
  }
`;

const resolvers: GraphQLResolverMap<{
  dataSources: {
    customerAPI: CustomerAPI;
  };
}> = {
  Query: {
    customer(_root: any, { id }, { dataSources: { customerAPI } }) {
      return customerAPI.getCustomer(id);
    },
    customers(_root: any, _args, { dataSources: { customerAPI } }) {
      return customerAPI.getCustomers();
    },
  },
  Customer: {
    __resolveReference({ id }, { dataSources: { customerAPI } }) {
      return customerAPI.getCustomer(id);
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
    customerAPI: new CustomerAPI(),
  }),
});

exports.handler = server.createHandler();
