
import "dotenv/config"

const config={

 
    PORT:process.env.PORT,
    MONGO_URL:process.env.CONNECTION_STRING,

}
export default config