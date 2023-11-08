import { Request, Response } from "express";
import axios from "axios";

interface dataType {
	name: string;
	email: string;
	subject: string;
	message: string;
}

const TOKEN = "6182732393:AAEaon3732C55YRsWvLNdaEtLRKh4TSGhww";
const CHAT_ID = "-1001985016010";
const API_URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

const messageModel = (data: dataType) => {
	let messageTG = `Name: <b>${data.name}</b>\n`;
	messageTG += `Email: <b>${data.email}</b>\n`;
	messageTG += `Subject: <b>${data.subject}</b>\n`;
	messageTG += `Message: <b>${data.message}</b>\n`;

	return messageTG;
};

const sendData = async (req: Request, res: Response) => {
	const { data }: { data: dataType } = req.body;

	try {
		await axios.post(API_URL, {
			chat_id: CHAT_ID,
			parse_mode: "html",
			text: messageModel(data)
		});

		res.status(200).send({
			success: true,
			data: data
		});
	} catch (err) {
		res.status(500).send({
			success: false,
			error: "Failed to send message to Telegram."
		});
	}
};

export default {
	sendData
};
