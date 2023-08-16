
const ALLOWED_EXTENSION = ['jpg', 'jpeg', 'png']

export function FileFilter(req: Express.Request, file: Express.Multer.File, callback: Function) {

    const type = file.mimetype.split('/')[1]

    if (!ALLOWED_EXTENSION.includes(type))
        return callback(null, false)

    return callback(null, true)

}