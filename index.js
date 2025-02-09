const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

(async function startServer() {
  // Connect to MongoDB
  await connectDB();

  const app = express();
  app.use(cors());

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start Apollo Server
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();