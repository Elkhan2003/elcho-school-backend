import { RouteHandler } from "fastify";
import { z } from "zod";
import verifySchemas from "./verify.schemas";

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// import twilio from "twilio";
// const client = twilio(accountSid, authToken);

const sendSmsCodeVerify: RouteHandler<{
	Body: z.TypeOf<typeof verifySchemas.sendSmsCodeVerification.body>;
	Reply: z.TypeOf<typeof verifySchemas.sendSmsCodeVerification.response>;
}> = async (req, res) => {
	const user = req.user!;
	const { phone, traffic } = req.body;

	if (!user.isPhoneVerified && phone) {
		await req.server.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				phone: phone,
				isPhoneVerified: !user.isPhoneVerified,
				traffic: traffic || "unknown"
			}
		});
	}

	const verifiedUser = await req.server.prisma.user.findUnique({
		where: {
			id: user.id
		}
	});

	await res.status(200).send({
		success: true,
		data: {
			verifiedUser
		}
	});
};

export default {
	sendSmsCodeVerify
};
