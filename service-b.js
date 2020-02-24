const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const loggingPlugin = require("./logging-plugin.js");

const typeDefs = gql`
  extend type User @key(fields: "id") {
    id: ID! @external
    friends: [User!]!
    pet: Pet
  }

  type Pet {
    id: ID!
    name: String!
    owner: User
    place: Place
  }

  extend interface Place @key(fields: "id") {
    id: ID! @external
  }

  extend type House implements Place @key(fields: "id") {
    id: ID! @external
  }

  extend type Query {
    pets: [Pet!]!
  }
`;

// The `owner` property is filled in below
const pets = [
  {id: 1, name: "Buddy", place: {id: 3, __typename: "House"}},
  {id: 2, name: "Ellie", place: {id: 4, __typename: "House"}},
]

const petsById = {}

pets.forEach(pet => {
  petsById[pet.id] = pet
})

// The `friends` property is filled in below
const users = [
  {id: 1, pet: petsById[1]},
  {id: 2, pet: petsById[2]},
]

const usersById = {}

users.forEach(user => {
  usersById[user.id] = user
})

usersById[1]['friends'] = [usersById[2]]
usersById[2]['friends'] = [usersById[1]]

users.forEach(user => {
  user.pet.owner = user
})

const resolvers = {
  Query: {
    pets: () => pets,
  },
  User: {
    __resolveReference(user) {
      return usersById[user.id]
    }
  }
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  plugins: [loggingPlugin],
});

server.listen(4002).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
