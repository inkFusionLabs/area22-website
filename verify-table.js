// Quick verification of Supabase table structure
// Run with: node verify-table.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://wcxwadutvxvwuxgxhlhr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeHdhZHV0dnh2d3V4Z3hobGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTYxOTAsImV4cCI6MjA3MjczMjE5MH0.haEeMvPhX9mY2iY7qNrSK-abR4V4JDcXPgm-UriDmI0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyTable() {
    console.log('🔍 Verifying Supabase table structure...\n');

    try {
        // Check if we can select from the table
        const { data, error } = await supabase
            .from('song_requests')
            .select('*')
            .limit(1);

        if (error) {
            console.log('❌ Error accessing table:', error.message);
            return;
        }

        console.log('✅ Table exists and is accessible');
        console.log('📊 Sample data structure:');

        if (data && data.length > 0) {
            console.log(JSON.stringify(data[0], null, 2));
        } else {
            console.log('📝 Table is empty (this is normal)');
        }

        // Test insert
        console.log('\n🧪 Testing insert...');
        const testData = {
            song_title: 'Test Song',
            artist_name: 'Test Artist',
            guest_name: 'Test Guest',
            note: 'Test note',
            priority: 'normal',
            status: 'pending',
            event_code: 'default'
        };

        const { data: insertData, error: insertError } = await supabase
            .from('song_requests')
            .insert([testData])
            .select();

        if (insertError) {
            console.log('❌ Insert failed:', insertError.message);
        } else {
            console.log('✅ Insert successful!');
            console.log('🆔 Created record ID:', insertData[0].id);

            // Clean up test record
            await supabase.from('song_requests').delete().eq('id', insertData[0].id);
            console.log('🗑️ Test record cleaned up');
        }

    } catch (error) {
        console.log('❌ Verification failed:', error.message);
    }
}

verifyTable();
