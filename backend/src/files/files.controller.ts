import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, BadRequestException, UploadedFiles } from '@nestjs/common';
import { FilesService } from './files.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { storage } from './storage.config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('files') // Swagger tag
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  // @Public()
  // @Post('upload')
  // @ResponseMessage('File uploaded successfully')
  // @UseInterceptors(FileInterceptor('avatar', { storage }))
  // // @UseInterceptors(AnyFilesInterceptor({ storage }))
  // uploadFile(@UploadedFile(
  //   new ParseFilePipeBuilder()
  //     .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 }) // 10MB
  //     .addFileTypeValidator({
  //       fileType: /(jpg|jpeg|png|gif|pdf|docx|doc|txt)$/i, // Acceptable file types
  //     })
  //     .build({
  //       errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
  //     }),
  // ) file: Express.Multer.File) {
  //   return {
  //     fileName: `${file.destination.split('/')[2]}/${file.filename}`
  //   };
  // }

  @Post('upload')
  @UseInterceptors(AnyFilesInterceptor({ storage }))
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('File is required');
    }

    if (files.length > 1) {
      throw new BadRequestException('Only one file can be uploaded per request');
    }
    const file = files[0];

    // Manual validation based on fieldname
    if (file.fieldname === 'avatar' || file.fieldname === 'post') {
      if (!/(jpg|jpeg|png|gif|webp)$/i.test(file.originalname.split('.').pop())) {
        throw new BadRequestException('Invalid image file type');
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException('File too large');
      }
    } else if (file.fieldname === 'resume') {
      if (!/(pdf|doc|docx)$/i.test(file.originalname.split('.').pop())) {
        throw new BadRequestException('Invalid document file type');
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException('File too large');
      }
    } else {
      throw new BadRequestException('Unsupported fieldname');
    }

    return {
      fileName: `${file.destination.split('/')[2]}/${file.filename}`
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
