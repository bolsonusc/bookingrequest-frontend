
console.log("✅ Running from:", process.cwd());

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

const envPath = new URL('../.env.local', import.meta.url).pathname;
console.log("✅ Attempting to load env from:", envPath);

try {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error("❌ Error loading .env:", result.error);
  } else {
    console.log("✅ .env loaded successfully");
  }
} catch (err) {
  console.error("❌ Failed to load .env:", err);
}

// Initialize Supabase Admin Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const users = [
  {
    email: 'provider1@example.com',
    phone: '+15555550101',
    password: 'Password123',
    username: 'provider_1',
    user_type: 'provider',
    first_name: 'John',
    last_name: 'Doe'
  },
  {
    email: 'client1@example.com',
    phone: '+15555550102', 
    password: 'Password123',
    username: 'client_1',
    user_type: 'client',
    first_name: 'Jane',
    last_name: 'Smith'
  }
];

async function seedUsers() {
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      phone: user.phone,
      password: user.password,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        username: user.username,
        user_type: user.user_type,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });

    if (error) {
      console.error(`❌ Error creating user ${user.email}:`, error);
    } else {
      console.log(`✅ Created user ${user.email}:`, data);
    }
  }
}

seedUsers().then(() => {
  console.log('🎉 Seeding complete!');
  process.exit(0);
});
