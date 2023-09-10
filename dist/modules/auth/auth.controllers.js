"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authUser = async (req, res) => {
    const { user } = req.body;
    const prisma = req.server.prisma;
    await authUserToSupabase(user.firstName, user.lastName, user.photo, user.email, user.traffic, prisma);
    console.log("Successfully authorization 🚀");
    return res.status(200).send({
        success: true,
        data: req.body
    });
};
// authentication user
const authUserToSupabase = async (first_name, last_name, photo, email, traffic, prisma) => {
    try {
        const authUser = await prisma.user.findFirst({
            where: { email: email }
        });
        if (!authUser) {
            await prisma.user.create({
                data: {
                    firstName: first_name,
                    lastName: last_name,
                    email: email,
                    password: "",
                    photo: photo,
                    traffic: traffic
                }
            });
        }
    }
    catch (err) {
        console.log(`${err}`);
    }
};
const getMeData = async (req, res) => {
    const { user } = req.body;
    const authUserData = await req.server.prisma.user.findFirst({
        where: { id: user.id }
    });
    return res.status(200).send({
        success: true,
        data: authUserData
    });
};
exports.default = { authUser, getMeData };
