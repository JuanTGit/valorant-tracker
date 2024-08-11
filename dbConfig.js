import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

export default pool;

// async function createTrackersTable() {
// 	try {
// 	  const query = `
// 		CREATE TABLE IF NOT EXISTS trackers (
// 		  username VARCHAR(255) NOT NULL,
// 		  tag VARCHAR(255) NOT NULL,
// 		  current_rank VARCHAR(255),
// 		  PRIMARY KEY (username, tag)
// 		);
// 	  `;
  
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
  
// 	  client.release();
// 	} catch (error) {
// 	  console.error('Error checking table:', error);
// 	}
//   }
  
// checkTable();