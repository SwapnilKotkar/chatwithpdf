import { Schema, model, models } from "mongoose";

const filesSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		fileId: { type: String, required: true },
		name: { type: String, required: true },
		size: { type: Number, required: true },
		type: { type: String, required: true },
		downloadUrl: { type: String, required: true },
		ref: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const Files = models?.Files || model("Files", filesSchema);

export default Files;
