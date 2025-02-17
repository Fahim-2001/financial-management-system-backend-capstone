const { PrismaClient } = require("@prisma/client");
const { generateTimestamp } = require("../../utils/generativeFunctions");
const {
    findSmallestAvailableId,
} = require("../../utils/findSmallestAvailableId");
const prisma = new PrismaClient();

// Service to get all services
const getAllServices = async () => {
    return await prisma.service.findMany({ orderBy: { id: "asc" } });
};

// Service to get a service by ID
const getServiceById = async (id) => {
    return await prisma.service.findUnique({
        where: { id },
    });
};

// Service to create a new service
const createService = async (data) => {
    const { title, price, type, facilities, session_type, userId } = data;
    const date = generateTimestamp();

    const missingId = await findSmallestAvailableId("service");

    return await prisma.service.create({
        data: {
            id: missingId,
            title,
            price,
            type,
            facilities,
            session_type,
            userId,
            created_at: date,
            updated_at: date,
        },
    });
};

// Service to update an existing service
const updateService = async (id, data) => {
    const { title, price, type, facilities, session_type, userId } = data;
    const dateOfUpdate = generateTimestamp();
    return await prisma.service.update({
        where: { id },
        data: {
            title,
            price,
            type,
            facilities,
            session_type,
            userId,
            updated_at: dateOfUpdate,
        },
    });
};

// Service to delete a service
const deleteService = async (id) => {
    return await prisma.service.delete({
        where: { id },
    });
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};
