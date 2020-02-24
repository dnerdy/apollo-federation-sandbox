const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const loggingPlugin = require("./logging-plugin.js");

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String
    place: Place
  }

  interface Place @key(fields: "id") {
    id: ID!
    name: String!
  }

  type School implements Place @key(fields: "id") {
    id: ID!
    name: String!
  }

  type House implements Place @key(fields: "id") {
    id: ID!
    name: String!
  }

  extend type Query {
    users: [User!]!
    places: [Place!]!
  }
`;

const places = [
  {
    id: 1,
    name: "Caltech",
    __typename: "School",
  },
  {
    id: 2,
    name: "University of California, Berkeley",
    __typename: "School",
  },
  {
    id: 3,
    name: "Richard's House",
    __typename: "House",
  },
  {
    id: 4,
    name: "Marina's House",
    __typename: "House",
  },
]

const placesById = {};

places.forEach(place => {
  placesById[place.id] = place
})

const users = [
  {
    id: 1,
    name: 'Richard Feynman',
    place: placesById[1],
  },
  {
    id: 2,
    name: 'Marina Ratner',
    place: placesById[2],
  },
];

const usersById = {};

users.forEach(user => {
  usersById[user.id] = user
})

const resolvers = {
  Query: {
    users: () => users,
    places: () => places,
  },
  User: {
    __resolveReference(reference) {
      return {id: reference.id, ...usersById[reference.id]}
    }
  },
  House: {
    __resolveReference(reference) {
      return placesById[reference.id]
    }
  },
  School: {
    __resolveReference(reference) {
      return placesById[reference.id]
    }
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  plugins: [loggingPlugin],
});

// The `listen` method launches a web server.
server.listen(4001).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
