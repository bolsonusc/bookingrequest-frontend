
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, token } = req.body;

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
