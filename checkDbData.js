import pool from './dbConfig.js'

async function checkTableData() {
    try {
        // const trackerTable = await pool.query('SELECT * FROM trackers');
        // const channelTable= await pool.query('SELECT * FROM trackers');

        const serverTable = await pool.query('SELECT * FROM trackers');

        // console.log('Tracking Data:', channelTable.rows);
        console.log('Tracker Data:', serverTable.rows)
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await pool.end();
    }
}

// checkTableData();