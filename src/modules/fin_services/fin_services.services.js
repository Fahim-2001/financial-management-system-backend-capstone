const { PrismaClient } = require("@prisma/client");
const { generateTimestamp } = require("../../utils/generativeFunctions");
const {
    findSmallestAvailableId,
} = require("../../utils/findSmallestAvailableId");
const prisma = require("../../config/prisma.config");

const getAllServices = async () => {
    return await prisma.service.findMany({ orderBy: { id: "asc" } });
};

const getServiceById = async (id) => {
    return await prisma.service.findUnique({
        where: { id },
    });
};

const createService = async (data) => {
    const { title, price, type, facilities, session_type, userId } = data;
    const date = generateTimestamp();

    const missingId = await findSmallestAvailableId("service");
    const faci = facilities.toString();
    return await prisma.service.create({
        data: {
            id: missingId,
            title,
            price,
            type,
            facilities: faci,
            session_type,
            userId,
            created_at: date,
            updated_at: date,
        },
    });
};

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
