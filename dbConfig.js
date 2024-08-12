import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.HEROKU_POSTGRESQL_AMBER_URL,
    ssl: {
        rejectUnauthorized: false
    },
});

export default pool;

// async function createChannelTable() {
//     try {
//         const query = `
//             CREATE TABLE channel_settings (
//             server_id VARCHAR(255) PRIMARY KEY,
//             channel_id VARCHAR(255) NOT NULL
//         );
//         `;

//         const res = await pool.query(query);
//         console.log('Channel settings table added successfully!')
//     } catch (err) {
//         console.log('error creating table', err);
//     } finally {
//         pool.end();
//     }
// }

// createChannelTable();

// async function createTrackersTable() {
// 	try {
// 	  const query = `
// 		CREATE TABLE trackers (
//         server_id VARCHAR(255) NOT NULL,
//         username VARCHAR(255) NOT NULL,
//         tag VARCHAR(255) NOT NULL,
//         current_rank VARCHAR(255),
//         agent VARCHAR(255) NOT NULL,
//         PRIMARY KEY (server_id, username, tag)
//         );
// 	`;
  
// 	  const res = await pool.query(query);
// 	  console.log("Table 'trackers' created successfully");
// 	} catch (err) {
// 	  console.error("Error creating table:", err);
// 	} finally {
// 	  pool.end();
// 	}
// }
  
// createTrackersTable();

// async function addConstraint() {
//     try {
//         const query = `
//             ALTER TABLE trackers
//             ADD CONSTRAINT unique_tracker UNIQUE (server_id, username, tag);
//         `;

//         await pool.query(query);
//         console.log("Constraints added to 'trackers' table successfully");
//     } catch (err) {
//         console.error("Error adding constraint:", err);
//     }
// }

// addConstraint();


// async function checkTable() {
// 	try {
// 	  const client = await pool.connect();
// 	  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
// 	  console.log('Tables:', res.rows);
  
// 	  // Optionally, check the structure of a specific table
// 	  const tableStructure = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'trackers';");
// 	  console.log('Table Structure:', tableStructure.rows);
// 	  const tableStructure2 = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'channel_settings';");
// 	  console.log('Table Structure:', tableStructure2.rows);
  
// 	  client.release();
// 	} catch (error) {
// 	  console.error('Error checking table:', error);
// 	}
//   }
  
// checkTable();