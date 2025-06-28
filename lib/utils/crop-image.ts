/* eslint-disable @typescript-eslint/no-explicit-any */
export default function getCroppedImg(
  imageSrc: string,
  crop: any,
  mimeType: string = "image/jpeg"
): Promise<Blob> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const canvas = document.createElement("canvas");
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      canvas.toBlob((blob) => {
        resolve(blob!);
      }, mimeType);
    };
  });
}
