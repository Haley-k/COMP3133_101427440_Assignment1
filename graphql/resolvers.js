const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Employee = require("../model/Employee");
require("dotenv").config();

const resolvers = {
  Query: {
    /**
     * Query: login
     * Allows user to access the system.
     * - Either username or email can be used with password.
     * - Returns AuthPayload (token, user, message).
     */
    login: async (_, { username, email, password }) => {
      try {
        // Find user by username OR email
        let user = null;
        if (username) {
          user = await User.findOne({ username });
        } else if (email) {
          user = await User.findOne({ email });
        }

        if (!user) {
          return {
            token: null,
            user: null,
            message: "User not found",
          };
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return {
            token: null,
            user: null,
            message: "Invalid password",
          };
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        return {
          token,
          user,
          message: "Login successful",
        };
      } catch (error) {
        console.error("Login Error:", error);
        throw new Error("Unable to login");
      }
    },

    /**
     * Query: getAllEmployees
     * Returns a list of all employees
     */
    getAllEmployees: async () => {
      try {
        const employees = await Employee.find({});
        return employees;
      } catch (error) {
        console.error("getAllEmployees Error:", error);
        throw new Error("Failed to get employees");
      }
    },

    /**
     * Query: searchEmployeeByEid
     * User can get employee details by employee id
     */
    searchEmployeeByEid: async (_, { eid }) => {
      try {
        const employee = await Employee.findById(eid);
        if (!employee) {
          throw new Error("Employee not found");
        }
        return employee;
      } catch (error) {
        console.error("searchEmployeeByEid Error:", error);
        throw new Error(error.message || "Failed to fetch employee");
      }
    },

    /**
     * Query: searchEmployeeByDesignationOrDepartment
     * User can get employee list by designation or department
     */
    searchEmployeeByDesignationOrDepartment: async (
      _,
      { designation, department }
    ) => {
      try {
        let filter = {};
        if (designation) filter.designation = designation;
        if (department) filter.department = department;

        const employees = await Employee.find(filter);
        return employees;
      } catch (error) {
        console.error("searchEmployeeByDesignationOrDepartment Error:", error);
        throw new Error("Failed to fetch employee list");
      }
    },
  },

  Mutation: {
    /**
     * Mutation: signup
     * Allows user to create new account (username/email must be unique)
     * Returns AuthPayload (token, user, message)
     */
    signup: async (_, { username, email, password }) => {
      try {
        // Check if user with username or email already exists
        const existingUser = await User.findOne({
          $or: [{ username }, { email }],
        });
        if (existingUser) {
          throw new Error("Username or Email already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });
        await newUser.save();

        // Generate token
        const token = jwt.sign(
          { userId: newUser._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        return {
          token,
          user: newUser,
          message: "Account created successfully",
        };
      } catch (error) {
        console.error("Signup Error:", error);
        throw new Error(error.message);
      }
    },

    /**
     * Mutation: addNewEmployee
     * User can create new employee
     */
    addNewEmployee: async (_, { input }) => {
      try {
        // Basic validation example:
        if (
          !input.first_name ||
          !input.last_name ||
          !input.email ||
          !input.designation ||
          !input.salary ||
          !input.date_of_joining ||
          !input.department
        ) {
          throw new Error("All required fields must be provided");
        }

        // Email uniqueness check
        const existingEmp = await Employee.findOne({ email: input.email });
        if (existingEmp) {
          throw new Error("Employee with this email already exists");
        }

        const newEmployee = new Employee({
          ...input,
        });
        await newEmployee.save();
        return newEmployee;
      } catch (error) {
        console.error("addNewEmployee Error:", error);
        throw new Error(error.message);
      }
    },

    /**
     * Mutation: updateEmployeeByEid
     * User can update employee details by employee id
     */
    updateEmployeeByEid: async (_, { eid, input }) => {
      try {
        const employee = await Employee.findById(eid);
        if (!employee) {
          throw new Error("Employee not found");
        }

        // Update the employee details
        Object.keys(input).forEach((key) => {
          employee[key] = input[key];
        });

        await employee.save();
        return employee;
      } catch (error) {
        console.error("updateEmployeeByEid Error:", error);
        throw new Error(error.message);
      }
    },

    /**
     * Mutation: deleteEmployeeByEid
     * User can delete employee by employee id
     */
    deleteEmployeeByEid: async (_, { eid }) => {
      try {
        const employee = await Employee.findById(eid);
        if (!employee) {
          throw new Error("Employee not found");
        }
        await employee.deleteOne();
        return { message: "Employee deleted successfully" };
      } catch (error) {
        console.error("deleteEmployeeByEid Error:", error);
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;