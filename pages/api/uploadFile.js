import supabase from '../../Lib/supabase';
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
      const files = await parseForm(req);

      if (!files.file || files.file.length === 0) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const file = files.file[0];
      const fileName = file.originalFilename;
      const fileContent = fs.readFileSync(file.path);
      const mimeType = 'application/pdf';

      const { data, error } = await supabase.storage
        .from('requirements')
        .upload(`RequirementFiles/${fileName}`, fileContent, { 
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ success: false, error: error.message });
      }

      const { publicUrl } = supabase.storage
        .from('requirements')
        .getPublicUrl(`https://ncvlhbaeyxtzdfketglj.supabase.co/storage/v1/object/public/RequirementFiles/${fileName}`);

      if (!publicUrl) {
        console.error('Error generating public URL');
        return res.status(500).json({ success: false, message: 'Failed to generate public URL' });
      }

      return res.status(200).json({ success: true, blobUrl: publicUrl });
    } catch (error) {
      console.error('Error in file upload handler:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form({ keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};