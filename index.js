const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
      type User {
        id: ID!
        name: String!
        username: String!
        phone: String!
        website: String!
      }
      type Todo {
        id: ID!
        title: String!
        completed: Boolean
        user: User
      }
      type Query {
        getTodos: [Todo]
        getUsers: [User]
        getUser(id: ID!): User
      }
    `,
    resolvers: {
      Todo: {
        user: async (parent) => {
          const res = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${parent.userId}`
          );
          return res.data;
        },
      },
      Query: {
        getTodos: async () => {
          const res = await axios.get(
            "https://jsonplaceholder.typicode.com/todos"
          );
          return res.data;
        },
        getUsers: async () => {
          const res = await axios.get(
            "https://jsonplaceholder.typicode.com/users"
          );
          return res.data;
        },
        getUser: async (_, { id }) => {
          const res = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${id}`
          );
          return res.data;
        },
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
}

startServer();
