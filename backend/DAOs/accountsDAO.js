/* Developer: Daniel De Guzman */
/* accountsDAO.js - data access object for accounts. */

/* import mongodb library - D.D. */
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

/* accounts placeholder to handle results of methods below - D.D. */
let accounts

export default class AccountsDAO{

    /* injects the accounts DB into MongoDB or loads it if it already exists - D.D. */
    static async injectDB(conn){
        if(accounts){
            return
        }
        try{
            console.log("Start loading accounts...")
            const database = await conn.db(process.env.RESTBIGGOLF_NS)
            accounts = database.collection("accounts")
            console.log("Finished loading accounts!")
        } catch(e){
            console.error(
                `Unable to establish a connection handle in accountsDAO: ${e}`,
            )
        }
    }

    /* gets all accounts in the DB - D.D. */
    static async getAccounts({
        filters = null,
        page = 0,
        accountsPerPage = 20,
    } = {}){
        let query
        if(filters){
            if("accountId" in filters){
                query = {$text: {$search: filters["accountId"]}}
            }
        }

        let cursor
        try{
            cursor = await accounts
                .find(query)
        } catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return {accountList: [], totalNumAccounts: 0}
        }

        const displayCursor = cursor.limit(accountsPerPage).skip(accountsPerPage * page)
        
        try{
            const accountsList = await displayCursor.toArray()
            const totalNumAccounts = await accounts.countDocuments(query)

            return {accountsList, totalNumAccounts}
        } catch(e){
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return {accountsList: [], totalNumAccounts: 0}
        }
    }

    /* Gets a specific account by the username - D.D. */
    static async getAccountByUsername(username){
        try{
            /* query search to find the account with the username - D.D.*/
            const pipeline = [
                {
                    $match: {
                        username: username
                    }
                }
            ]
            return await accounts.aggregate(pipeline).next()
        } catch(e){
            console.error(`Something went wrong in getAccountByUsername: ${e}`)
            throw e
        }
    }

    /* Gets a specific account by the credentials (username and password) - D.D. */
    static async getAccountByCredentials(username, password){
        try{
            /* query search to find the account with the username - D.D.*/
            const pipeline = [
                {
                    $match: {
                        username: username,
                        password: password,
                    }
                }
            ]
            return await accounts.aggregate(pipeline).next()
        } catch(e){
            console.error(`Something went wrong in getAccountByCredentials: ${e}`)
            throw e
        }
    }

    /* Adds an account, used in Registration Pages. - D.D. */
    static async addAccount(username, password, cityQuestion, foodQuestion, friendQuestion){
        try{
            /* city, food, and friend questions are security questions that will be used to change an accounts password. - D.D. */
            const accountDoc = {
                username: username,
                password: password,
                cityQuestion: cityQuestion,
                foodQuestion: foodQuestion,
                friendQuestion: friendQuestion,
                friendsList: []
            }
            /* adds the account to the DB - D.D. */
            return await accounts.insertOne(accountDoc)
        } catch(e){
            console.error(`Unable to post account: ${e}`)
            return {error: e}
        }
    }

    /* Updates/changes the account password - D.D.*/
    static async updateAccount(accountId, user, pass){
        try{
            const updateResponse = await accounts.updateOne(
                /* Find the account with the matching username and accountId - D.D. */
                {username: user, _id: ObjectId(accountId)},
                /* Update the password to the new password - D.D. */
                {$set: {password: pass}},
            )
            return updateResponse
        } catch(e){
            console.error(`Unable to update account: ${e}`)
            return {error: e}
        }
    }

    /* Adds a friend to the friend list - D.D. */
    static async addFriendToAccount(user, friendUser){

        // authentication will be added when notifications gets implemented...

        /* Let A be the "user", and B be the "friendUser" */
        /* First, try adding B to A's friend list */
        try{
            /* update the account, $push appends to an array */
            const updateResponse = await accounts.updateOne(
                {username: user},
                {$push: {friendsList: friendUser}}
            )
        } catch(e){
            console.error(`Unable to add a friend to main user: ${e}`)
            return {error: e}
        }
        
        /* Then, try adding A to B's friend list */
        try{
            const updateResponse = await accounts.updateOne(
                {username: friendUser},
                {$push: {friendsList: user}}
            )
            return updateResponse;
        } catch(e){
            console.error(`Unable to add a friend from to friend account: ${e}`)
            return {error: e}
        } 
    }

    /* Deletes an account based on its accountId - D.D. */
    static async deleteAccount(accountId){
        try{
            const accountResponse = await accounts.deleteOne({
                _id: ObjectId(accountId),
            })
            return accountResponse
        } catch(e){
            console.error(`Unable to delete account: ${e}`)
            return {error: e}
        }
    }
}