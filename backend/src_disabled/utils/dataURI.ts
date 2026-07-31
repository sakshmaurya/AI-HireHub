import DatauriParser from 'datauri/parser';

const parser = new DatauriParser();

export const getDataUri = (file: Express.Multer.File): string => {
  return parser.format(file.originalname, file.buffer).content;
};

export const bufferToDataURI = (
  buffer: Buffer,
  mimeType: string
): string => {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
};
