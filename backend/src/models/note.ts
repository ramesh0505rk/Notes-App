import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema({
    userId:{type:Schema.Types.ObjectId,required:true},
    title: { type: String, required: true },
    text: { type: String },
}, { timestamps: true })

type Note = InferSchemaType<typeof noteSchema>

export default model<Note>("Note",noteSchema)
// type myFun=()=>number
// type newType=string
// let x:newType='ramesh'
// x='55'
// let fun:myFun=()=>{
//     console.log("ramz")
//     console.log("peter")
//     return 5
// }
// function dis(pill:{x:String;y:number;}){

// }
// dis({x:"ramesh",y:21})