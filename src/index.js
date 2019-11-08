const { GraphQLServer } = require("graphql-yoga");
const { PubSub } = require('graphql-subscriptions')

// ----------------------- DATA STORE -----------------------
let links = [
    {
        id: "link-0",
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL"
    }
];
let idCount = links.length;
const pubsub = new PubSub();
const NEW_LINK = 'newLink';

// ----------------------- SCHEMA -----------------------
const typeDefs = `
type Query {
    info: String!
    feed: [Link!]!
}

type Mutation {
    post(url: String!, description: String!): Link!
}

type Subscription {
    newLink: Link
}

type Link {
    id: ID!
    description: String!
    url: String!
}

`;

// ----------------------- RESOLVERS -----------------------
const resolvers = {
    Query: {
        info: () => "This is the API of a Hackernews Clone",
        feed: () => links
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            };
            links.push(link);
            pubsub.publish(NEW_LINK, link);
            return link;
        }
    },
    Subscription: {
        newLink: {
            resolve: (payload) => {
                return payload;
            },
            subscribe: () => pubsub.asyncIterator(NEW_LINK)
        }
    },
    Link: {
        id: (parent) => parent.id,
        description: (parent) => parent.description,
        url: (parent) => parent.url,
    }
};

// ----------------------- SERVER -----------------------
const server = new GraphQLServer({
    typeDefs,
    resolvers
});
server.start(() => console.log("Server is running on http://localhost:4000"));
