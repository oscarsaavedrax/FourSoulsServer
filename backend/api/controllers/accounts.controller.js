/* Developer: Daniel De Guzman */
/* accounts.controller.js - controller used to handle payloads from HTTP requests, which will be translated to the accountsDAO. */

/* Import libraries and AccountsDAO - D.D. */
import mongodb from "mongodb"
import AccountsDAO from "../../DAOs/accountsDAO.js"

export default class AccountsController{

    /* Handles the requests/response of getting all accounts - D.D. */
    static async apiGetAccounts(req, res, next){
        const accountsPerPage = req.query.accountsPerPage ? parseInt(req.query.accountsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if(req.query.accountId){
            filters.accountId = req.query.accountId
        }

        const {accountsList, totalNumAccounts} = await AccountsDAO.getAccounts({
            filters,
            page,
            accountsPerPage,
        })

        let response = {
            accounts: accountsList,
            page: page,
            filters: filters,
            entries_per_page: accountsPerPage,
            total_results: totalNumAccounts,
        }
        
        res.json(response)
    }

    /* Handles the GET request for getting account by a specific username - D.D. */
    static async apiGetAccountByUsername(req, res, next){
        try{
            /* putting the username from the request body into a variable - D.D. */
            let username = req.params.username || {}

            /* calling the DAO to retrieve the account by the username - D.D. */
            let account = await AccountsDAO.getAccountByUsername(username);
            if(!account){
                res.status(404).json({error: "Not found"})
                return
            }
            /* return the response as JSON - D.D. */
            res.json(account)
            console.log(req.body)
        } catch(e){
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    /* Handles the GET request for getting account by it's credentials - D.D. */
    static async apiGetAccountByCredentials(req, res, next){
        try{
            /* putting the username from the request body into a variable - D.D. */
            let username = req.params.username || {}
            
            /* putting the password from the request body into a variable - D.D. */
            let password = req.params.password || {}

            /* calling the DAO to retrieve the account by the username - D.D. */
            let account = await AccountsDAO.getAccountByCredentials(username, password)
            if(!account){
                res.status(404).json({error: "Not found"})
                return
            }
            /* return the response as JSON - D.D. */
            res.json(account)
        } catch(e){
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
    
    /* Handles the POST request for adding an account - D.D. */
    static async apiPostAccount(req, res, next){
        try{
            /* store the request's account requirements in variables - D.D. */
            const username = req.body.username
            const password = req.body.password
            const cityQuestion = req.body.cityQuestion
            const foodQuestion = req.body.foodQuestion
            const friendQuestion = req.body.friendQuestion
            
            /* Add the account to the DB - D.D.*/
            const accountResponse = await AccountsDAO.addAccount(
                username,
                password,
                cityQuestion,
                foodQuestion,
                friendQuestion
            )

            /* return the response as JSON - D.D. */
            res.json({status: "success"})
            console.log(req.body)
        } catch(e){
            res.status(500).json({error: e.message})
        }
    }

    /* Handles the PUT request for changing an account password - D.D. */
    static async apiUpdateAccount(req, res, next){
        try{
            /* store the request's account requirements in variables - D.D. */
            const accountId = req.body.accountId
            const username = req.body.username
            const password = req.body.password

            /* Call the updateAccount method in AccountsDAO to handle request - D.D. */
            const accountResponse = await AccountsDAO.updateAccount(
                accountId,
                username,
                password
            )

            var {error} = accountResponse
            if(error){
                res.status(400).json({error})
            }
            if(accountResponse.modifiedCount === 0){
                throw new Error(
                    "unable to update account"
                )
            }

            /* return the response as JSON - D.D. */
            res.json({status: "success"})
        } catch(e){
            console.log(req.body);
            res.status(500).json({error: e.message})
        }
    }

    /* Handles the PUT request for adding a friend - D.D. */
    static async apiAddFriendToAccount(req, res, next){
        try{
            /* Store the username of main user and friend from request body - D.D. */
            const username = req.body.username
            const friendUsername = req.body.friendUsername

            /* Call addFriendToAccount method to add the friend - D.D. */
            const accountResponse = await AccountsDAO.addFriendToAccount(
                username,
                friendUsername
            )

            var {error} = accountResponse
            if(error){
                res.status(400).json({error})
            }
            if(accountResponse.modifiedCount === 0){
                throw new Error(
                    "unable to add a friend"
                )
            }

            /* return the response as JSON - D.D. */
            res.json({status: "success"})
        } catch(e){
            console.log(req.body);
            res.status(500).json({error: e.message})
        }
    }

    /* Handles the DELETE request to delete an account - D.D. */
    static async apiDeleteAccount(req, res, next){
        try{
            /* put the accountId from the request into a variable - D.D. */
            const accountId = req.body.accountId
            console.log(accountId)

            /* call AccountsDAO.deleteAccount to handle deleting an account from the DB - D.D. */
            const accountResponse = await AccountsDAO.deleteAccount(
                accountId
            )
            res.json({status: "success"})
        } catch(e){
            res.status(500).json({error: e.message})
        }
    }
}