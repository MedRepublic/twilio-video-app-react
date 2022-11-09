import express from "express";
import { Room } from "../models";
const router = express.Router();

module.exports = router;

router.get('/',async(req, res)=>{
    try {
        const data: Room[] = await Room.findAll();
        res.status(200).json({status:200, message:"test", data})    
    } catch (error) {
        res.status(400).json({status:400, data:null, message:error})
    }    
})

router.get('/:roomName',async (req,res) => {
    try {
        const data: Room | null  = await Room.findOne({where:{roomName: req.params.roomName}});
        res.status(200).json({status:200, message:"test", data})  
    } catch (error) {
        res.status(400).json({status:400, data:null, message:error})
    }
})

router.post('/create', async (req, res) => {
try {
    const data: Room | null = await Room.create({...req.body})
    res.status(200).json({status:200, data, message:"Room created successfully"})
} catch (error) {
    res.status(400).json({status:400, data:null, message:error})
    }    
})