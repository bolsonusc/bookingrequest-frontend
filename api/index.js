
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import sendgrid from '@sendgrid/mail';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Not the anon key!
);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const authenticateUser = (req, res, next)=>{
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.decode(token, { complete: true });

    // You can use Supabase Admin API or decode only
    const { sub: userId } = decoded.payload;

    req.user = { id: userId };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// User routes
app.get('/api/users', async (req, res) => {
  const {phone} = req.query;
  try{
    if(phone){
      const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone);

      if(error){
        return res.status(400).json({error, message: "Error while fetching user!"});
      }
      return res.status(200).json({data:user?.[0] || null, message: "User fetched successfully!"});
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if(!error){
      return res.status(200).json({data, message: "Users fetched successfully!"});
    } else {
      return res.status(400).json({error, message: "Error while fetching users!"});
    }
  } catch(error){
    return res.status(500).json({error, message: "Internal Server Error!"});
  }
});

app.post('/api/users', authenticateUser, async (req, res) => {
  try{
    const { data, error } = await supabase
      .from('profiles')
      .insert([ req.body ]);

    if(!error){
      return res.status(200).json({data, message: "User created successfully!"});
    } else {
      return res.status(400).josn({error, message: "Error while creating user!"});
    }
  } catch(error){
    return res.status(500).json({error, message: "Internal Server Error!"});
  }
});

app.get('/api/users/:id', authenticateUser, async (req, res) => {
  try{
    const id = req.params.id;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id);

    if(!error){
      return res.status(200).json({data: data?.[0], message: "User fetched successfully!"});
    } else {
      return res.status(400).json({error, message: "Error while fetching user!"});
    }
  } catch(error){
    return res.status(500).json({error, message: "Internal Server Error!"});
  }
});

app.put('/api/users/:id', authenticateUser, async (req, res) => {
  const id = req.params.id;
  try{
    const { error } = await supabase
      .from('profiles')
      .update(req.body)
      .eq('id', id);

    if(!error){
      return res.status(200).json({ message: "User updated successfully!"});
    } else {
      return res.status(400).json({error, message: "Error while updating user!"});
    }
  } catch(error){
    return res.status(500).json({error, message: "Internal Server Error!"});
  }
});

const otpStore = {};

app.post('/api/send-otp', authenticateUser, async (req, res) => {
  const { email } = req.body;
  try{
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('backup_email', email);

    if(error){
      return res.status(400).json({error, message: "Error while sending OTP!"});
    }
    else if(user?.[0]){
      return res.status(400).json({error, message: "This email is already present. Try with new email!"});
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 mins later
  
    // Store OTP
    otpStore[email] = {
      code: otp,
      expiresAt
    };
    const sendResult = await sendOtpEmail(email, otp);

    if (!sendResult.success) {
      return res.status(500).json({message: 'Failed to send email!'});
    }
  
    return res.status(200).json({message: 'OTP sent successfully'});

  } catch(error){
    return res.status(500).json({error, message: "Internal Server Error!"});
  }
});

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL; // your SendGrid verified sender

export async function sendOtpEmail(toEmail, otp) {
  sendgrid.setApiKey(SENDGRID_API_KEY);
  const response = await sendgrid.send({
    to: toEmail,
    from: FROM_EMAIL,
    subject: "OTP for 2FA Verification",
    content: [
      {
        type: 'text/plain',
        value: `Your verification code is: ${otp}`,
      },
    ],
  });

  if (response[0].statusCode > 299 && response[0].statusCode<200) {
    return { success: false };
  }

  return { success: true };
}

app.post('/api/verify-otp', authenticateUser, async (req, res) => {
  const { email, otp, id } = req.body;
  try{
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('backup_email', email);

    if(error){
      return res.status(400).json({error, message: "Error while verifying email!"});
    }
    else if(user?.[0]){
      return res.status(400).json({error, message: "This email is already present. Try with new email!"});
    }

    // OTP Validation
    const otpRecord = otpStore[email];
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found or expired. Please request a new one." });
    }
    const { code, expiresAt } = otpRecord;
  
    if (Date.now() > expiresAt) {
      delete otpStore[email];
      return res.status(410).json({ message: "OTP has expired. Please request a new one." });
    }
  
    if (otp !== code) {
      return res.status(400).json({ message: "Invalid verification code. Please try again." });
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({'backup_email': email, 'secure': true})
      .eq('id', id);

    if(updateError){
      return res.status(400).json({error: updateError, message: "Some error occurred while verfying OTP. Please try again later!"});
    }

    return res.status(200).json({message: "Email verified successfully!"})

  } catch(error){
    return res.status(500).json({error, message: "Internal Server Error!"});
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
