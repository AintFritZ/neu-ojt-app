import supabase from '../../Lib/supabase'; // Import the Supabase client
import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';  // Importing path module for safer file paths

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { files, fields } = await parseForm(req);

      if (!files || !files.file || files.file.length === 0) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const file = files.file[0]; 
      const userId = fields.userId ? fields.userId[0] : 'anonymous'; 
      const fileBuffer = fs.readFileSync(file.path);

      // Sanitize the file name and ensure the file path is safe
      const sanitizedFileName = file.originalFilename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filePath = `RequirementFiles/${userId}/${sanitizedFileName}`;

      // Upload the file to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('requirements') // Specify the bucket name
        .upload(filePath, fileBuffer, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

      // Get the public URL for the uploaded file
      const { publicURL, error: urlError } = supabase
        .storage
        .from('requirements')
        .getPublicUrl(filePath);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        return res.status(500).json({ success: false, error: urlError.message });
      }

      return res.status(200).json({ success: true, fileUrl: publicURL });
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
        reject(err); 
      } else {
        resolve({ fields, files });
      }
    });
  });
};