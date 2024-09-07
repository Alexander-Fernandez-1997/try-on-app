import { Product } from "@/components/Product";
import { Client, handle_file } from "@gradio/client";

export default async function Home() {
  async function fetchData() {
    try {
      const person = handle_file(
        "https://jallenjia-change-clothes-ai.hf.space/file=/tmp/gradio/6c346f7fc3337e056050d69b7ceee6c9b212d7fe/background.png"
      );

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
    } catch (error: any) {
      console.error("Error details:", JSON.stringify(error, null, 2));
    }
  }

  // await fetchData();

  return <Product />;
}
