import fs from "fs";
import path from "path";

export async function GET() {
  const blogPath = path.join(process.cwd(), "public/blogImages");
  const files = fs.readdirSync(blogPath);
  const images = files.map((file) => `/blogImages/${file}`);

  return Response.json(images);
}
