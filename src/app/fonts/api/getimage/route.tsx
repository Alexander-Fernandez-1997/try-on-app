// /pages/api/tryon.ts
import { Client, handle_file } from "@gradio/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fileBuffer } = req.body;

  try {
    // Process file and predict result
    const person = handle_file(Buffer.from(fileBuffer));
    const cloth = handle_file(
      "https://jallenjia-change-clothes-ai.hf.space/file=/tmp/gradio/2576ee3b4c17e7576be382c80ef276a52376bc5c/bocaa.jpg"
    );

    const client = await Client.connect("jallenjia/Change-Clothes-AI", {
      hf_token: process.env.HF_API_KEY || "",
    });

    const result = await client.predict("/tryon", {
      dict: {
        background: person,
        layers: [],
        composite: person,
      },
      garm_img: cloth,
      garment_des: "",
      is_checked: true,
      is_checked_crop: false,
      denoise_steps: 30,
      seed: -1,
      category: "upper_body",
    });

    res.status(200).json({
      success: true,
      data: result.data[0]["url"],
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, data: error.message });
  }
}
