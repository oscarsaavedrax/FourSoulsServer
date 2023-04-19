/* Developer: Daniel De Guzman */
/* server.js - backend server to route HTTP requests to Database. */

/* Import libraries necessary - D.D. */
import express from "express"
import cors from "cors"

/* import the list of routes for account HTTP requests - D.D. */
import accounts from "./api/routes/accounts.route.js"

/* using Express for backend */
const app = express()

app.use(cors())
app.use(express.json())

/* url to send account requests to - D.D. */
app.use("/api/v1/accounts", accounts)

/* any other url will be a 404 not found error - D.D. */
app.use("*", (req, res) => res.status(404).json({error: "Not Found"}))

export default app