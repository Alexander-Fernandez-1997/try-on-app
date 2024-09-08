"use server";
import { Client, handle_file } from "@gradio/client";

async function fetchImage(file: any) {
  try {
    // Create a file from the blob and pass it to handle_file
    const person = handle_file(file);
    console.log("person", person);

    const cloth = handle_file(
      "https://jallenjia-change-clothes-ai.hf.space/file=/tmp/gradio/2576ee3b4c17e7576be382c80ef276a52376bc5c/bocaa.jpg"
    );

    const client = await Client.connect("jallenjia/Change-Clothes-AI", {
      hf_token: `hf_${process.env.HF_API_KEY}` || "",
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

    console.log("API Response:", result.data);
    const answer = {
      success: true,
      data: (result.data as any)[0]["url"],
    };
    return answer;
  } catch (error: any) {
    console.error("Error details:", JSON.stringify(error, null, 2));
    return {
      success: false,
      data: error.message,
    };
  }
}

export async function handleSubmit(formData: FormData) {
  console.log("formData", formData);
  const file = formData.get("image") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log("buffer", buffer);

  const response = await fetchImage(buffer);
  console.log("response", response);
  if (response.success) {
    return { success: true, resultImage: response.data };
  } else {
    return { success: false, resultImage: "/no-result.avif" };
  }
}

export default fetchImage;
