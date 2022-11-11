import express from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import sign from 'jwt-encode';
import { Room } from "../models";
const router = express.Router();

module.exports = router;

router.get('/', async (req, res) => {
    try {
        const data: Room[] = await Room.findAll();
        res.status(200).json({ status: 200, message: "test", data })
    } catch (error) {
        res.status(400).json({ status: 400, data: null, message: error })
    }
})

router.post('/detail', async (req, res) => {
    try {
        const { room, name } = req.body;
        const data: Room | null = await Room.findOne({ where: { roomName: room, userName: name } });
        if (data) {
            res.status(200).json({ status: 200, data, message: "Room Detail" })
        } else {
            res.status(404).json({ status: 404, data: null, message: "User detail not exist" })
        }
    } catch (error) {
        res.status(400).json({ status: 400, data: null, message: error })
    }
})

router.get('/room/:roomName', async (req, res) => {
    try {
        const data: Room[] = await Room.findAll({ where: { roomName: req.params.roomName } });
        res.status(200).json({ status: 200, message: "test", data })
    } catch (error) {
        res.status(400).json({ status: 400, data: null, message: error })
    }
})

router.get('/request/:roomName', async (req, res) => {
    try {
        const data: Room[] = await Room.findAll({ where: { roomName: req.params.roomName, inRoomAdded: false } });
        res.status(200).json({ status: 200, message: "test", data })
    } catch (error) {
        res.status(400).json({ status: 400, data: null, message: error })
    }
})
router.get('/user/:userName', async (req, res) => {
    try {
        const data: Room[] = await Room.findAll({ where: { userName: req.params.userName } });
        res.status(200).json({ status: 200, message: "test", data })
    } catch (error) {
        res.status(400).json({ status: 400, data: null, message: error })
    }
})

// router.post('/create', async (req, res) => {
//     try {
//         const checkRoom: Room | null = await Room.findOne({ where: { roomName: req.body.roomName } })
//         const data: Room | null = await Room.create({ ...req.body })
//         res.status(200).json({ status: 200, data, message: "Room created successfully" })
//     } catch (error) {
//         res.status(400).json({ status: 400, data: null, message: error })
//     }
// })

router.put('/edit/:roomId', async (req, res) => {
    try {
        await Room.update({ ...req.body }, { where: { id: req.params.roomId } })
        const data: Room | null = await Room.findByPk(req.params.roomId)
        res.status(200).json({ status: 200, data, message: "Room created successfully" })
    } catch (error) {
        res.status(400).json({ status: 400, data: null, message: error })
    }
})

router.post('/token', async (req, res, next) => {
    try {
        const secret = 'secret';
        const data = {
            room: req.body.room,
            name: req.body.name,
        };
        const checkExistRoom: Room | null = await Room.findOne({ where: { roomName: data.room, userName: data.name } })
        if (!checkExistRoom) {
            const dataResponse: Room | null = await Room.create({ roomName: data.room, userName: data.name });
            const jwt = sign(data, secret);
            res.status(200).json({ status: 200, data: { jwt, ...dataResponse.toJSON() }, message: 'User token' })
        } else {
            const jwt = sign(data, secret);
            res.status(200).json({ status: 200, data: { jwt, ...checkExistRoom.toJSON() }, message: 'User token' })
        }
    } catch (error) {
        throw error;
    }
})

router.delete('/deleteRequest/:id', async (req, res, next) => {
    try {
        const data: Room | null = await Room.findByPk(req.params.id)
        await Room.destroy({ where: { id: req.params.id } })
        res.status(200).json({ status: 200, data, message: 'Request deleted successfully' })
    } catch (error) {
        throw error;
    }
})

router.put('/roomRequest/:id', async (req, res, next) => {
    try {
        await Room.update({ inRoomAdded: true }, { where: { id: req.params.id } })
        const data: Room | null = await Room.findByPk(req.params.id)
        res.status(200).json({ status: 200, data, message: 'Request accepted successfully' })
    } catch (error) {
        throw error;
    }
})