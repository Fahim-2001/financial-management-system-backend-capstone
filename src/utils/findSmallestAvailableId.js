const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findSmallestAvailableId = async (model = null) => {
    const records = await prisma[model].findMany({
        select: { id: true },
        orderBy: { id: "asc" },
    });

    let currentId = 1;
    for (const record of records) {
        if (record.id === currentId) {
            currentId++;
        } else {
            break;
        }
    }

    return currentId;
};

module.exports = { findSmallestAvailableId };
