//EXPRESS JS and Mongoose
 const express = require('express');
const mongoose=require('mongoose');
const cors= require('cors')

 //create an instance for express
 const app = express();
 //middleware(decode jsom)
 app.use(express.json())
 //cors middleware
 app.use(cors())

 //put the item in memory
//let todos=[]; USE DB INSTEAD

//CONNECTING MONGODB
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() =>{ //promise
    console.log('DB connected!');
})
.catch((err) => {
    console.log(err);
})

//creating schema //const variable //constructor
const todoSchema= new mongoose.Schema({
    //object
    title:{
        required:true,
        type:String
    },
    description:String
})

//create model //Todo singular
const todoModel=mongoose.model('Todo',todoSchema);

//create a new todo item
 app.post('/todos',async (req,res) =>{
    const {title,description} =req.body;
    try {
        const newTodo=new todoModel({title,description});
         //method calling
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
    
    
})
 
//get all items(api)
    app.get('/todos', async (req,res) => {
        try { //find -get all the items ...It takes time so await
            const todos=await todoModel.find();
            res.json(todos);
        } catch (error) {
            console.log(error);
            res.status(500).json({message:error.message});
            
        }
    })

    //update a toto item //id parameter
    app.put("/todos/:id", async(req,res) =>{
        try {
            const {title,description} =req.body;
        //get id parameter
        const id=req.params.id;
       const updatedTodo= await todoModel.findByIdAndUpdate(
            id,
            { title, description },//will update in db
            //will update in postman
            { new : true}

        )
        if(!updatedTodo){ //if data is not there
            return res.status(404).json({message:"Todo not found"})
        }
        res.json(updatedTodo)
        } catch (error) {
            console.log(error);
            res.status(500).json({message:error.message});
        }
        
    })

    //Delete an item
    app.delete('/todos/:id',async (req,res) => {
        try {
            const id=req.params.id;
            await todoModel.findByIdAndDelete(id);
            res.status(204).end(); //success but doesnt return content
        } catch (error) {
            console.log(error);
            res.status(500).json({message:error.message});
        }
       
    })



 //start the server
 //port number - 
 const port = 8000;
 app.listen(port, () => {
    console.log("Server is listening to port "+port);
 })