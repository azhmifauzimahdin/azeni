function extractCloudinaryPublicId(url: string): string | null {
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  const afterUpload = parts[1];
  const partsAfterVersion = afterUpload.split("/");
  partsAfterVersion.shift();
  const publicIdWithExt = partsAfterVersion.join("/");
  return publicIdWithExt.replace(/\.[^/.]+$/, "");
}

export default extractCloudinaryPublicId;
