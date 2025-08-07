import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Public()
  @Post('/chat')
  @ResponseMessage("Generate data from AI model")
  async generateData(@Body('message') question: string) {
    return await this.aiService.generateData(question);
    // return await this.aiService.generateDataWithOpenAI(question);
  }

}
