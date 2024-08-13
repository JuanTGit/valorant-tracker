import pool from './dbConfig.js'

async function checkTableData() {
    try {
        // const trackerTable = await pool.query('SELECT * FROM trackers');
        const channelTable= await pool.query('SELECT username, tag, current_rank, server_id FROM trackers');

        // const serverTable = await pool.query('SELECT * FROM channel_settings');

        console.log('Tracking Data:', channelTable.rows);
        // console.log('Channel Data:', channelTable.rows)
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await pool.end();
    }
}

// checkTableData();