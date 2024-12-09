import { put } from '@vercel/blob';
import multiparty from 'multiparty';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable built-in bodyParser to handle file streams
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { files, fields } = await parseForm(req);

      if (!files || !files.file || files.file.length === 0) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const file = files.file[0]; // Get the first file in the array
      const userId = fields.userId ? fields.userId[0] : 'anonymous'; // Use userId from fields, fallback to 'anonymous'

      // Read the file from the uploaded path
      const fileBuffer = fs.readFileSync(file.path);

      // Define the file path, including the user-specific folder
      const blobPath = `RequirementFiles/${userId}/${file.originalFilename}`;

      // Upload the file to Vercel Blob
      const blob = await put(blobPath, fileBuffer, {
        access: 'public',
      });

      return res.status(200).json({ success: true, blobUrl: blob.url });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form({ keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err); // Reject the promise if an error occurs
      } else {
        resolve({ fields, files }); // Resolve with fields and files
      }
    });
  });
};
