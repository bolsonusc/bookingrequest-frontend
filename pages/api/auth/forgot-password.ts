
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.body;

  try {
    // Verify phone number first
    const { data: userData } = await supabase
      .from('profiles')
      .select('email')
      .eq('phone', phone)
      .single();

    if (!userData?.email) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(
      userData.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      }
    );

    if (error) throw error;

    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    return res.status(500).json({ error: 'Error processing request' });
  }
}
