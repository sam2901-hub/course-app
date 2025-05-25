import mongoos from "mongoose";
import config from "./config.js";



async function dbconnect(){
    try{

        await mongoos.connect(config.MONGO_URL)
        console.log("database connected successfully");
        

    }catch(error){
        console.log("unable to connect database",error);
        

    }
    
}
export default dbconnect