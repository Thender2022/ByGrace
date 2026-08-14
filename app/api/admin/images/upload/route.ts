import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    // 1. Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // 2. Validate that a file was uploaded
    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // 3. Validate file type (only images)
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPEG, PNG, WebP, GIF, or SVG." },
        { status: 400 }
      );
    }

    // 4. Read the file buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 5. Process the image with Sharp (resize and compress)
    let processedBuffer = fileBuffer;
    let fileExtension = file.name.split(".").pop() || "jpg";

    // Skip processing for SVG
    if (file.type !== "image/svg+xml") {
      try {
        // Resize to max 1200px width/height while maintaining aspect ratio
        // Compress JPEG and PNG quality
        const sharpInstance = sharp(fileBuffer);
        
        // Get metadata to check orientation
        const metadata = await sharpInstance.metadata();
        
        // Resize if larger than 1200px on any side
        const maxDimension = 1200;
        if (metadata.width && metadata.width > maxDimension || 
            metadata.height && metadata.height > maxDimension) {
          processedBuffer = await sharpInstance
            .resize(maxDimension, maxDimension, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .jpeg({ quality: 80, progressive: true })
            .toBuffer();
          
          // Update extension for compressed format
          fileExtension = 'jpg';
        } else {
          // Just compress without resizing
          processedBuffer = await sharpInstance
            .jpeg({ quality: 80, progressive: true })
            .toBuffer();
          fileExtension = 'jpg';
        }
      } catch (sharpError) {
        console.error("Sharp processing error:", sharpError);
        // Fall back to original file if processing fails
        processedBuffer = fileBuffer;
      }
    }

    // 6. Generate a unique filename
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    // 7. Ensure the uploads directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 8. Save the processed file to disk
    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, processedBuffer);

    // 9. Return the URL path to store in the database
    const imageUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      filename: uniqueFilename,
      originalSize: file.size,
      processedSize: processedBuffer.length,
      message: "Image uploaded and optimized successfully",
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}