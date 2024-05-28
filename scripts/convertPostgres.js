const { Client } = require('pg');
const fs = require('fs');

// Database connection details
const DATABASE_URL = process.env.DATABASE_URL;
// Connect to the PostgreSQL database
const client = new Client({
  connectionString: DATABASE_URL,
});

async function fetchRows() {
  try {
    await client.connect();
    console.log('Connected to the database');

    // Replace 'your_table_name' with the actual table name
    const res = await client.query('SELECT * FROM bookmark');
    
    // Convert each row to JSON Lines format, converting all integers to strings
    const jsonlResult = res.rows.map(row => {
      const convertedRow = {};
      for (const key in row) {
        if (typeof row[key] === 'number' && Number.isInteger(row[key])) {
          convertedRow[key] = row[key].toString(); // Convert integers to strings
        } else {
          convertedRow[key] = row[key];
        }
      }
      return JSON.stringify(convertedRow);
    }).join('\n');

    // Save the JSONL object to a file
    fs.writeFileSync('data/rows.jsonl', jsonlResult);
    
    console.log('Rows fetched and saved to rows.jsonl');
  } catch (err) {
    console.error('Error fetching rows:', err);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

fetchRows();
