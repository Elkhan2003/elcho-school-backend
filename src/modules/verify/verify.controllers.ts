import { Request, Response } from "express";
import { prisma, User } from "../../plugins/prisma";

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// import twilio from "twilio";
// const client = twilio(accountSid, authToken);

interface bodyTypes {
	phone: string;
	traffic: string | undefined;
}

const sendSmsCodeVerify = async (req: Request, res: Response) => {
	const user = req.user! as User;
	const { phone, traffic } = req.body as bodyTypes;

	if (!user.isPhoneVerified && phone) {
		const verifyUser = await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				phone: phone,
				isPhoneVerified: !user.isPhoneVerified,
				traffic: traffic || "unknown"
			}
		});

		res.status(200).send({
			success: true,
			data: {
				verifyUser
			}
		});
	}
};

export default {
	sendSmsCodeVerify
};
