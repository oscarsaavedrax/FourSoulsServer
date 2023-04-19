/* Developer: Daniel De Guzman */
/* accounts.route.js - list of all HTTP routes for requests to the Accounts DB */
import express from "express"
/* Import the accounts controller which will help handle the payload for HTTP Requests - D.D. */
import AccountsCtrl from "../controllers/accounts.controller.js"

/* Using express router to route our requests to the server - D.D. */
const router = express.Router()

/* base URL for account api will all start with http://localhost:3000/api/v1/accounts - D.D. */

/* GET Request for all accounts - D.D. */
router.route("/").get(AccountsCtrl.apiGetAccounts)

/* GET Request for retrieving an account by credentials - D.D. */
router.route("/username/:username/password/:password").get(AccountsCtrl.apiGetAccountByCredentials)

/* GET Request for retrieving an account by a username - D.D. */
router.route("/username/:username").get(AccountsCtrl.apiGetAccountByUsername)

/* PUT Request for adding a friend to the friend list. - D.D. */
router.route("/add-friend").put(AccountsCtrl.apiAddFriendToAccount);

/* POST, PUT, and DELETE requests will start have base URL + /account - D.D. */
router
    .route("/account")
    .post(AccountsCtrl.apiPostAccount)
    .put(AccountsCtrl.apiUpdateAccount)
    .delete(AccountsCtrl.apiDeleteAccount)

export default router