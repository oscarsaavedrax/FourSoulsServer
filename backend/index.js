/* Developer: Daniel De Guzman */
/* index.js - connection to MongoDB Database */

/* Import libraries needed - D.D. */
import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"

/* AccountsDAO is the data access object for Accounts - D.D. */
import AccountsDAO from "./DAOs/accountsDAO.js"

/* Load the .env file into 'process' - D.D */
dotenv.config()
const MongoClient = mongodb.MongoClient
const port = process.env.PORT || 8000

/* Connect to the MongoDB Collection - D.D. */
MongoClient.connect(
    process.env.RESTFOURSOULSONLINE_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true}
    )
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        /* Create/connect to accounts collection in MongoDB - D.D. */
        await AccountsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })