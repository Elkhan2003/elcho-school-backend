import { Request, Response } from "express";
import { prisma, User } from "../../plugins/prisma";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VAadd1ebe9e29e73cb35becf6978bac987";
import twilio from "twilio";
const client = twilio(accountSid, authToken);

interface bodyTypes {
	phone: string;
	code: string;
	traffic: string | undefined;
}

const sendSmsCodeVerify = async (req: Request, res: Response) => {
	const user = req.user! as User;
	const { phone, traffic } = req.body as bodyTypes;

	if (!user) {
		return res.status(401).send({
			message: "The user is not authenticated."
		});
	}

	const getUser = await prisma.user.findFirst({
		where: {
			id: user.id
		}
	});

	if (!getUser?.isPhoneVerified && phone) {
		try {
			const verifyUser = await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					phone: phone,
					traffic: traffic || "unknown"
				}
			});

			const verification = await client.verify.v2
				.services(verifySid)
				.verifications.create({ to: phone, channel: "sms" });

			res.status(200).send({
				success: true,
				verifyStatus: verification.status,
				data: {
					verifyUser
				}
			});
		} catch (err) {
			res.status(500).send({
				success: false,
				error: "Internal Server Error",
				details: `Backend function sendSmsCodeVerify: ${err}`
			});
		}
	} else {
		res.status(400).send({
			success: true,
			message: "You are already verified"
		});
	}
};

const checkSmsCodeVerify = async (req: Request, res: Response) => {
	const user = req.user as User;
	const { code } = req.body as bodyTypes;

	if (!user) {
		return res.status(401).send({
			message: "The user is not authenticated."
		});
	}

	const getUser = await prisma.user.findFirst({
		where: {
			id: user.id
		}
	});

	try {
		const verificationCheck = await client.verify.v2
			.services(verifySid)
			.verificationChecks.create({ to: getUser?.phone!, code: code });
		const { status, dateCreated, dateUpdated } = verificationCheck;

		if (status === "approved") {
			try {
				const verifyUser = await prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						isPhoneVerified: true
					}
				});

				res.status(200).send({
					success: true,
					data: {
						status,
						dateCreated,
						dateUpdated,
						verifyUser
					}
				});
			} catch (err) {
				res.status(500).send({
					success: false,
					error: "Internal Server Error",
					details: `Backend function checkSmsCodeVerify: ${err}`
				});
			}
		}
	} catch (err) {
		res.status(500).send({
			success: false,
			error: "Invalid code",
			details: `Backend function checkSmsCodeVerify: ${err}`
		});
	}
};

export default {
	sendSmsCodeVerify,
	checkSmsCodeVerify
};
