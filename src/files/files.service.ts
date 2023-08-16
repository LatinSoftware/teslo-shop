import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {

    getProductImagePath(fileName: string) {

        const path = join(__dirname, "../../static/uploads", fileName)

        if (!existsSync(path))
            throw new NotFoundException("Product image do not exist")

        return path;
    }
}
