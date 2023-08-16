import { Response } from 'express';
import { Controller, Get, Post, Res, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { FileNamer, FileFilter } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Get('products/:image')

  GetProductImage(
    @Res() res: Response,
    @Param('image') image: string,
  ) {

    const path = this.filesService.getProductImagePath(image)

    res.sendFile(path)

  }

  @Post('products')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: FileFilter,
      storage: diskStorage({
        destination: './static/uploads',
        filename: FileNamer
      })
    })
  )
  UploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ) {

    if (!file) throw new BadRequestException("Please submit a valid image type.")

    return {

      filename: file.filename
    }
  }
}
