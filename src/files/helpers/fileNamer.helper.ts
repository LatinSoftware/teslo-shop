import { v4 as uuid } from 'uuid'

export function FileNamer(req: Express.Request, file: Express.Multer.File, callback: Function) {

    const extension = file.mimetype.split('/')[1]

    const fileName = `${uuid()}.${extension}`

    return callback(null, fileName)

}