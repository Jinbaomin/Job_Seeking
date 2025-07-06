import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from './schemas/job.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Job", schema: JobSchema }])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService] // Export JobsService to make it available in other modules
})
export class JobsModule { }
