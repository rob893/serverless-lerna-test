const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'customers', url: 'http://localhost:3000/dev/customers' },
        { name: 'orders', url: 'http://localhost:3000/dev/orders' },
        { name: 'products', url: 'http://localhost:3000/dev/products' },
    ],
});

const server = new ApolloServer({
    gateway,
    subscriptions: false,
});

server.listen().then(res => {
    console.log('server ready at ' + res.url);
})