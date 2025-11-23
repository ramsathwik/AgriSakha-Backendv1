export function getPublicId(url) {
  const parts = url.split("/upload/")[1];
  const publicOne = parts.split(".")[0];
  const publicId = publicOne.split("/")[1];
  return publicId;
}
