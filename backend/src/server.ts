import "dotenv/config"
import env from './util/validateEnv'
import mongoose from "mongoose"
import app from "./app"

const port = env.PORT
mongoose.connect(env.MONGODB_CONNECTION_STRING!)
    .then(() => {
        console.log("Connected to the database")
        app.listen(port, () => {
            console.log("Server running on port: ", port)
        })
    })
    .catch(console.error)

