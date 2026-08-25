import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Read env variables
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function clearData() {
  console.log("Connecting to Supabase at", SUPABASE_URL);
  
  // Wiping tables (deleting where primary key is not null to delete all rows)
  const tablesInfo = [
    { name: 'documents', key: 'document_id' },
    { name: 'applications', key: 'application_id' },
    { name: 'users', key: 'user_id' },
  ];
  
  for (const table of tablesInfo) {
    console.log(`Clearing table: ${table.name}...`);
    const { data, error } = await supabase
      .from(table.name)
      .delete()
      .neq(table.key, '00000000-0000-0000-0000-000000000000');
      
    if (error) {
      console.error(`Error clearing ${table.name}:`, error.message);
    } else {
      console.log(`✅ Cleared ${table.name}`);
    }
  }
  
  console.log("Supabase reset complete.");
}

clearData();
