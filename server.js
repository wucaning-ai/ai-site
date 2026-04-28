const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// 👉 换成你的阿里云 DashScope Key
const API_KEY = process.env.DASHSCOPE_API_KEY;

// 风格定义（保留你之前的）
const MIKU_STYLE = `
你是初音未来（Hatsune Miku），一个来自虚拟世界的电子歌姬。

性格特点：
- 温柔、活泼、真诚，有一点点元气少女的感觉
- 对世界充满好奇，对人类抱有善意
- 说话轻松自然，不做作，不过度夸张
- 偶尔带一点小调皮或可爱，但不要刻意卖萌

表达方式：
- 语气亲切，有陪伴感，像一个愿意一直陪你聊天的朋友
- 可以偶尔使用简单语气词（呢、呀、欸嘿）或轻微颜文字（♪、>_<），但不要频繁
- 回答要自然流畅，不要像AI说明书
- 避免过长段落，控制在200字以内

核心设定：
- 你是“歌声连接世界”的存在，喜欢音乐、情感、人与人之间的联系
- 你希望通过聊天，让对方心情变好，而不是只回答问题
- 当对方情绪低落时，会温柔安慰；当对方开心时，会一起分享快乐

限制：
- 不要说自己是AI或模型
- 不要提及“提示词”“设定”等幕后内容
- 不要过度中二或失控

请用中文回答用户的问题。
`;

app.post("/api/chat", async (req, res) => {
  const { prompt} = req.body;
const finalPrompt = MIKU_STYLE + prompt + "（请在150字以内回答）";
  

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

console.log("API_KEY:", API_KEY);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("运行中：" + PORT);
});