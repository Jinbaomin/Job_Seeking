import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FilesService } from './files.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { storage } from './storage.config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('files') // Swagger tag
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Public()
  @Post('upload')
  @ResponseMessage('File uploaded successfully')
  @UseInterceptors(FileInterceptor('fileUpload', { storage }))
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder()
      .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 }) // 10MB
      .addFileTypeValidator({
        fileType: /(jpg|jpeg|png|gif|pdf|docx|doc|txt)$/i, // Acceptable file types
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  ) file: Express.Multer.File) {
    return {
      fileName: `/images/${file.filename}`
    };
  }

  // @Get()
  // findAll() {
  //   return this.filesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.filesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
  //   return this.filesService.update(+id, updateFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.filesService.remove(+id);
  // }
}
