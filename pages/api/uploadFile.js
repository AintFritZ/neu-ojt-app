import { put } from '@vercel/blob';
import multiparty from 'multiparty';
import fs from 'fs'; 
export const config = {
  api: {
    bodyParser: false,  
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const formData = await parseForm(req);

      if (!formData.file || formData.file.length === 0) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const file = formData.file[0];

      const fileContent = fs.readFileSync(file.path);

      const mimeType = 'application/pdf';

      const blob = await put(`RequirementFiles/${file.originalFilename}`, fileContent, { 
        access: 'public',
        headers: { 'Content-Type': mimeType } 
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
    const form = new multiparty.Form();  
    form.keepExtensions = true;  

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);  
      } else {
        resolve(files);  
      }
    });
  });
};