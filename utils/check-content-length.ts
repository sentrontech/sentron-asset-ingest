const checkContentLength = (
  contentLength: number,
  maxFileSize: number
): void => {
  if (!contentLength) {
    throw new Error("Cannot determine file size");
  }
  if (contentLength > maxFileSize) {
    throw new Error(`File too large: ${contentLength} > ${maxFileSize}`);
  }
};

export default checkContentLength;
