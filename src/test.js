const { GraphQLServer } = require('graphql-yoga');

// ----------------------- SCHEMA -----------------------
const typeDefs = `
type Query {
    info: String!
    feed: [Link!]!
}
`;

// ----------------------- RESOLVERS -----------------------
const resolvers = {
    Query: {
        info: () => "This is the API of a Hackernews Clone",
    },
};

// ----------------------- SERVER -----------------------
const server = new GraphQLServer({
    typeDefs,
    resolvers,
});
server.start(() => console.log('Server is running on http://localhost:4000'));