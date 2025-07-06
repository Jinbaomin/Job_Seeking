import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly modelAI;

  constructor() {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Google Generative AI API key is not set in environment variables.');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.modelAI = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  private extractText(response: any): string {
    try {
      return response.response.candidates[0].content.parts[0].text.replace(/```json\n?|\n```/g, '').trim();
    } catch {
      throw new Error('Failed to extract text from AI response.');
    }
  }

  async generateData(question: string): Promise<{ content: string; analysis?: string[] }> {
    const prompt = `Bạn giúp tôi trả lời câu hỏi sau: ${question}. Trả lời dưới dạng 1 đoạn văn khoảng 7 câu và không giải thích gì thêm dưới dạng markdown. 
    Lưu ý nếu câu hỏi không liên quan gì đến ngôn ngữ lập trình (như C++, Java, C#, Python, golang, ...), thư viện, framework và công nghệ thông tin nói chung. Chỉ trả về json dưới dạng sau: 
    {
      content: "Câu hỏi không liên quan đến lĩnh vực công nghệ thông tin.",
      analysis: []
    }
    Nếu như câu hỏi có liên quan hãy giúp tôi phân tích những framework có trong câu trả lời đó và trả về chính xác dưới dạng json theo định dạng sau:
    {
      content: "Nội dung câu trả lời",
      analysis: [
        "Framework 1",
        "Framework 2",
        "Framework 3",
        ...
      ]
    }
    `;

    try {
      const result = await this.modelAI.generateContent(prompt);
      const data = this.extractText(result);

      // const prompt1 = `Hãy giúp tôi phân những ngôn ngữ lập trình hay framework, thư viện có trong câu sau: ${data} dưới dạng json đúng theo định dạng sau: 
      // [
      //   Java,
      //   C++,
      //   Python,
      //   ...
      // ]. Lưu ý không trả lời thêm bất kỳ gì thêm ngoài định dạng json và không giải thích gì thêm.`;

      // const analysis = await this.modelAI.generateContent(prompt1);
      // const data2 = this.extractText(analysis);

      // return {
      //   content: JSON.parse(data),
      //   // analysis: JSON.parse(data2),
      // };

      return JSON.parse(data);
    } catch (error) {
      throw new Error('Failed to generate or analyze data: ' + error.message);
    }
  }
}


// {
//   "statusCode": 200,
//   "message": "",
//   "data": {
//       "response": {
//           "candidates": [
//               {
//                   "content": {
//                       "parts": [
//                           {
//                               "text": "```json\n{\n  \"tác_giả\": \"Phan Mạnh Quỳnh\"\n}\n```\n\n"
//                           }
//                       ],
//                       "role": "model"
//                   },
//                   "finishReason": "STOP",
//                   "avgLogprobs": -0.06381209373474121
//               }
//           ],
//           "usageMetadata": {
//               "promptTokenCount": 34,
//               "candidatesTokenCount": 25,
//               "totalTokenCount": 59,
//               "promptTokensDetails": [
//                   {
//                       "modality": "TEXT",
//                       "tokenCount": 34
//                   }
//               ],
//               "candidatesTokensDetails": [
//                   {
//                       "modality": "TEXT",
//                       "tokenCount": 25
//                   }
//               ]
//           },
//           "modelVersion": "gemini-2.0-flash",
//           "responseId": "b9BYaPXkK5TehMIPyoOx2As"
//       }
//   }
// }