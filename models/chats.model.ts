import { Schema, model, models } from "mongoose";

const chatsSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		fileId: { type: String, required: true },
		role: { type: String, required: true },
		message: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const Chats = models?.Chats || model("Chats", chatsSchema);

export default Chats;
