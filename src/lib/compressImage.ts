import { compress } from "image-conversion";
export async function compressFile(file: File, quality: number): Promise<Blob> {
  const compressed = await compress(file, quality);
  return compressed;
}
