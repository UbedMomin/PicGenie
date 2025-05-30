import mongoose, { connect } from "mongoose";


 const connectDB = async ()=>{

mongoose.connection.on('connected',()=> {
console.log("DataBase Connected")

})

    await mongoose.connect(`${process.env.MONGODB_URI}/Picgenie`)
 }

 export default connectDB;