//Function 1: run for each protected route
//Check if JWT is received
//If not, send back response saying you aren't signed in
//If yes, validate JWT using secret
//If true, decode the JWT and get the userID
//return true, and userID

//Function 2: Sign up
//Hash the password
//Insert data into SQL users table
//Send back a status saying whether sign up was successful or not

//Function 3: Login
//Get the username and password details
//Check if a similar username exists in database
//If user exists, pull all the details i.e. userID and password
//Check if password is correct using bcrypt
//Return whether authentication is done