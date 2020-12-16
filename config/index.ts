export default {
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE as string),
  bucket: process.env.S3_BUCKET as string,
};
