const express = require("express");
const finServicesRouter = express.Router();
const serviceController = require("./fin_services.controller");

// Routes for CRUD operations
finServicesRouter.get("/", serviceController.getAllServices); // Get all services
finServicesRouter.get("/:id", serviceController.getServiceById); // Get a service by ID
finServicesRouter.post("/", serviceController.createService); // Create a new service
finServicesRouter.put("/:id", serviceController.updateServiceById); // Update an existing service
finServicesRouter.delete("/:id", serviceController.deleteService); // Delete a service

module.exports = finServicesRouter;
