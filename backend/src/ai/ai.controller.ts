import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { Public } from 'src/decorator/customize';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Public()
  @Post('/chat')
  async generateData(@Body('message') question: string) {
    return await this.aiService.generateData(question);
  }

}
