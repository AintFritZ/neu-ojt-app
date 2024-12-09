import { put } from '@vercel/blob';  
import multiparty from 'multiparty';  

export const config = {
  api: {
    bodyParser: false,  // Disable default body parser
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Parse the incoming form data (file upload)
      const formData = await parseForm(req);

      if (!formData.file || formData.file.length === 0) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const file = formData.file[0]; 

      // Upload the file directly to Vercel Blob
      const blob = await put(`RequirementFiles/${file.originalFilename}`, file.path, { access: 'public' });

      // Respond with the URL of the uploaded file
      return res.status(200).json({ success: true, blobUrl: blob.url });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}

// Helper function to parse the incoming form data (file upload)
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();  // Initialize multiparty form parser
    form.keepExtensions = true;  // Retain file extensions

    // Parse the incoming request
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);  // Reject if errors during parsing
      } else {
        resolve(files);  // Resolve with parsed files
      }
    });
  });
};