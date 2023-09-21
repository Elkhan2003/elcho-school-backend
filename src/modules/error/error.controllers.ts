import { Request, Response } from "express";
import { prisma } from "../../plugins/prisma";

interface ErrorType {
	code: string;
	details: string;
	hint: string;
	message: string;
}

const sendError = async (req: Request, res: Response) => {
	const { error }: { error: ErrorType } = req.body;

	await prisma.error.create({
		data: {
			code: error.code || "",
			details: error.details || "",
			hint: error.hint || "",
			message: error.message || ""
		}
	});

	res.status(200).send({
		success: true,
		data: error
	});
};

export default {
	sendError
};
