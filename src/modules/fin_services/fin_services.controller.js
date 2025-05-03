const {
    getCachedData,
    setDataToCache,
    deleteCachedData,
} = require("../../utils/cache");
const serviceService = require("./fin_services.services");
const cacheKey = "services";

const getAllServices = async (req, res, next) => {
    try {
        let allServices = getCachedData(cacheKey);

        if (!allServices) {
            allServices = await serviceService.getAllServices();
            setDataToCache(cacheKey, allServices);
        }
        return res.status(200).json({
            success: true,
            total: allServices.length,
            data: allServices,
        });
    } catch (error) {
        next(error);
    }
};

const getServiceById = async (req, res, next) => {
    try {
        const { id } = req?.params;
        const service = await serviceService.getServiceById(Number(id));
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        return res.status(200).json({
            success: true,
            data: service,
        });
    } catch (error) {
        next(error);
    }
};

const createService = async (req, res, next) => {
    try {
        const serviceData = req?.body;
        const newService = await serviceService.createService(serviceData);

        deleteCachedData(cacheKey);
        return res.status(201).json({
            success: true,
            message: "Successfully created new service.",
            data: newService,
        });
    } catch (error) {
        next(error);
    }
};


const updateServiceById = async (req, res, next) => {
    try {
        const { id } = req?.params;
        const serviceData = req?.body;
        const updatedService = await serviceService.updateService(
            Number(id),
            serviceData
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        deleteCachedData(cacheKey);
        return res
            .status(200)
            .json({ success: true, message: "Service updated successfully!" });
    } catch (error) {
        next(error);
    }
};


const deleteService = async (req, res, next) => {
    try {
        const { id } = req?.params;

        const deletedService = await serviceService.deleteService(Number(id));

        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        deleteCachedData(cacheKey);
        return res.status(200).json({
            success: true,
            message: "Service deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateServiceById,
    deleteService,
};
