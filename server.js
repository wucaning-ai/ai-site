const express = require("express");
const path = require("path");


const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 👉 换成你的阿里云 DashScope Key
const API_KEY = "sk-b94172f7a46c40d2b748435c90a05d78";

// 风格定义（保留你之前的）
const styles = {
  "发疯": "用情绪极端、略带疯狂的语气回答：",
  "锐评": "用犀利、直接、带批判的语气回答：",
  "恋爱脑": "用恋爱脑、粘人、感性的语气回答：",
  "鲁迅": "模仿鲁迅的讽刺文风回答：",
  "孔子": "用古风、儒家语气回答：",
  "王阳明": "用心学、内省、哲思的语气回答："
};

app.post("/api/chat", async (req, res) => {
  const { prompt, style } = req.body;

  const finalPrompt = (styles[style] || "") + prompt+"(请在200字以内回答";

  try {
    const response = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "qwen-turbo",
          input: {
            messages: [
              { role: "user", content: finalPrompt }
            ]
          }
        })
      }
    );

    const data = await response.json();
    console.log(data);

    const text =
      data.output?.choices?.[0]?.message?.content ||
      data.output?.text ||
      "出错了";

    res.json({ text });

  } catch (err) {
    console.log(err);
    res.json({ text: "请求失败" });
  }
});

app.listen(3000, () => {
  console.log("运行：http://localhost:3000");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("运行中：" + PORT);
});