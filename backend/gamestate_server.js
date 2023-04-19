/* Developer: Daniel De Guzman */
/* server2.js - test server to test game state */
import express from "express"
import cors from "cors"
import childProcess from "child_process"

const app = express();
app.use(cors())
const spawner = childProcess.spawn;
app.get('/python', (req, res) => {

    let data1;
    const data_to_pass_in = {
        // data_sent: 'Send this to python script',
        data_returned: '',
        // roomId: "PUT_ROOM_ID_HERE",
        players: [{}],
        theStack: {},
        board: {},
        dice: {},
        // activePlayerIndex: 1,
    };
    
    console.log('Data has been sent to python script');
    console.log()
    /* Call the python process to calculate the game state */
    const python_process = spawner('python', ['./game constructs/GameState.py', JSON.stringify(data_to_pass_in)]);

    /* Handle output from python process */
    python_process.stdout.on('data', function (data){
        console.log('Data received from python script: ', JSON.parse(data));
        res.json(JSON.parse(data.toString()))
    })
})

/* Listen to the server on port 3001 */
app.listen(3002, () => console.log(`python server app listening on port 3002`));