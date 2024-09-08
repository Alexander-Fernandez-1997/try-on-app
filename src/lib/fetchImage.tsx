"use server";

import { Client, handle_file } from "@gradio/client";

interface PredictResult {
  data: {
    url: string;
  }[];
}

export async function handleSubmit(formData: FormData) {
  try {
    const file = formData.get("image") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const person = handle_file(buffer);
    const cloth = handle_file(
      "https://jallenjia-change-clothes-ai.hf.space/file=/tmp/gradio/2576ee3b4c17e7576be382c80ef276a52376bc5c/bocaa.jpg"
    );

    const client = await Client.connect("jallenjia/Change-Clothes-AI", {
      hf_token: `hf_${process.env.HF_API_KEY}` || "",
    });

    const result = (await client.predict("/tryon", {
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
    })) as PredictResult;

    return {
      success: true,
      resultImage: result.data[0].url,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error details:", err);
    return {
      success: false,
      resultImage: "/no-result.avif",
    };
  }
}
