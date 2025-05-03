const express = require("express");
const finServicesRouter = express.Router();
const serviceController = require("./fin_services.controller");

finServicesRouter.get("/", serviceController.getAllServices); 
finServicesRouter.get("/:id", serviceController.getServiceById);
finServicesRouter.post("/", serviceController.createService); 
finServicesRouter.put("/:id", serviceController.updateServiceById); 
finServicesRouter.delete("/:id", serviceController.deleteService);

module.exports = finServicesRouter;
