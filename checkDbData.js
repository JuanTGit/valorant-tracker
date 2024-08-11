import pool from './dbConfig.js'

async function checkTableData() {
    try {
        const result = await pool.query('SELECT * FROM trackers');

        console.log('Table Data:', result.rows);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await pool.end();
    }
}

checkTableData();