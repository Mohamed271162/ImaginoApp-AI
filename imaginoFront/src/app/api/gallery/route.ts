import fs from "fs";
import path from "path";

export async function GET() {
  const galleryPath = path.join(process.cwd(), "public/galleryImages");
  const files = fs.readdirSync(galleryPath); 
  const images = files.map((file) => `/galleryImages/${file}`);

  return Response.json(images);
}
