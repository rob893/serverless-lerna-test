const { RESTDataSource } = require("apollo-datasource-rest");

const customers = [
  {
    id: 1,
    firstName: "Joe",
    lastName: "Smith",
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Smith",
  },
];

class CustomerAPI extends RESTDataSource {
  constructor() {
    super();
  }

  getCustomers() {
    return customers;
  }

  getCustomer(id) {
    return customers.find((c) => c.id === id);
  }
}

module.exports = {
  CustomerAPI,
};
