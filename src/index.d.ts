export type IFile = {
  filename: string; //tambahan ini ya, bukan bawaan file
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

declare global {
  namespace Express {
    interface Request {
      requestTime?: string;
      file?: IFile;
      files?: IFile[];
    }
  }
}
