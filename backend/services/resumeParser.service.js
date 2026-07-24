import axios from "axios";
import mammoth from "mammoth";
import { createRequire } from "module";
import Tesseract from "tesseract.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const extractResumeText = async (resumeUrl, mimeType) => {
  try {
    const response = await axios.get(resumeUrl, {
      responseType: "arraybuffer",
    });

    // PDF
    if (mimeType === "application/pdf") {
      const pdfData = await pdf(response.data);
      return pdfData.text;
    }

    // DOCX
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer: Buffer.from(response.data),
      });

      return result.value;
    }

    // DOC
    if (mimeType === "application/msword") {
      throw new Error(
        "DOC files are not supported yet. Please upload PDF or DOCX."
      );
    }

    // IMAGE (PNG, JPG, JPEG, WEBP)
if (mimeType.startsWith("image/")) {

  const imageBuffer = Buffer.from(response.data);

  const {
    data: { text },
  } = await Tesseract.recognize(
    imageBuffer,
    "eng",
    {
      logger: (m) => {
        console.log(m);
      },
    }
  );

  return text;
}

    throw new Error("Unsupported file format");
  } catch (error) {
    console.error("Resume parsing error:", error.message);
    throw new Error("Failed to extract resume text");
  }
};