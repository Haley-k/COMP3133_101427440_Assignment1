const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type AuthPayload {
    token: String
    user: User
    message: String
  }

  type Message {
    message: String
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  }

  type Query {
    login(username: String, email: String, password: String!): AuthPayload
    getAllEmployees: [Employee]
    searchEmployeeByEid(eid: ID!): Employee
    searchEmployeeByDesignationOrDepartment(
      designation: String
      department: String
    ): [Employee]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload
    addNewEmployee(input: EmployeeInput!): Employee
    updateEmployeeByEid(eid: ID!, input: EmployeeInput!): Employee
    deleteEmployeeByEid(eid: ID!): Message
  }
`;

module.exports = typeDefs;