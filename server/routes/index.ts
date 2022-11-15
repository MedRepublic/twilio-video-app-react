import express from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import sign from 'jwt-encode';
import room from "../models/room.model";
import m from '../helper/middleware'
const router = express.Router();

module.exports = router;

let Room: any = [];

// router.get('/', async (req, res) => {
//     try {
//         const data = await Room.findAll();
//         res.status(200).json({ status: 200, message: "test", data })
//     } catch (error) {
//         res.status(400).json({ status: 400, data: null, message: error })
//     }
// })

router.post('/detail', async (req, res) => {
    try {
        const { room, name } = req.body;
        const data = await Room.findOne({ where: { roomName: room, userName: name } });
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
        const data = await Room.findAll({ where: { roomName: req.params.roomName } });
        res.status(200).json({ status: 200, message: "test", data })
    } catch (error) {
        res.status(400).json({ status: 400, data: null, message: error })
    }
})

router.get('/request/:roomName', async (req, res) => {
    try {
        const data = await Room.findAll({ where: { roomName: req.params.roomName, inRoomAdded: false } });
        res.status(200).json({ status: 200, message: "test", data })
    } catch (error) {
        res.status(400).json({ status: 400, data: null, message: error })
    }
})
router.get('/user/:userName', async (req, res) => {
    try {
        const data = await Room.findAll({ where: { userName: req.params.userName } });
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
        const data = await Room.findByPk(req.params.roomId)
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
        const checkExistRoom = await Room.findOne({ where: { roomName: data.room, userName: data.name } })
        if (!checkExistRoom) {
            const dataResponse = await Room.create({ roomName: data.room, userName: data.name });
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
        const data = await Room.findByPk(req.params.id)
        await Room.destroy({ where: { id: req.params.id } })
        res.status(200).json({ status: 200, data, message: 'Request deleted successfully' })
    } catch (error) {
        throw error;
    }
})

router.put('/roomRequest/:id', async (req, res, next) => {
    try {
        await Room.update({ inRoomAdded: true }, { where: { id: req.params.id } })
        const data = await Room.findByPk(req.params.id)
        res.status(200).json({ status: 200, data, message: 'Request accepted successfully' })
    } catch (error) {
        throw error;
    }
})

/* All rooms */
router.get('/', async (req, res) => {
    await room.getRooms()
        .then((data: any) => res.json({ status: 200, message: "All Rooms Detail", data }))
        .catch((err: { status: number; message: any; }) => {
            if (err.status) {
                res.status(err.status).json({ status: err.status, data: null, message: err.message })
            } else {
                res.status(500).json({ status: err.status, data: null, message: err.message })
            }
        })
})

/* A room by id */
router.get('/:id', m.mustBeInteger, async (req, res) => {
    const id = req.params.id;
    await room.getRoom(id)
        .then((data: any) => res.json({ status: 200, message: "Room detail", data }))
        .catch((err: { status: number; message: any; }) => {
            if (err.status) {
                res.status(err.status).json({ status: err.status, data: null, message: err.message })
            } else {
                res.status(500).json({ status: 500, data: null, message: err.message })
            }
        })
})

/* Insert a new room */
router.post('/', m.checkFieldsPost, async (req, res) => {
    await room.insertRoom(req.body)
        .then((room: { id: any; }) => res.status(201).json({
            status: 200,
            message: `The room #${room.id} has been created`,
            data: room
        }))
        .catch((err: { message: any; }) => res.status(500).json({ status: 500, data: null, message: err.message }))
})

/* Update a room */
router.put('/:id', m.mustBeInteger, m.checkFieldsPost, async (req, res) => {
    const id = req.params.id;
    await room.updateRoom(id, req.body)
        .then((room: any) => res.json({
            status: 200,
            message: `The room #${id} has been updated`,
            data: room
        }))
        .catch((err: { status: number; message: any; }) => {
            if (err.status) {
                res.status(err.status).json({ status: err.status, data: null, message: err.message })
            }
            res.status(500).json({ status: 500, data: null, message: err.message })
        })
})

/* Delete a room */
router.delete('/:id', m.mustBeInteger, async (req, res) => {
    const id = req.params.id;
    await room.deleteRoom(id)
        .then((room: any) => res.json({
            status: 200,
            data: null,
            message: `The room #${id} has been deleted`
        }))
        .catch((err: { status: number; message: any; }) => {
            if (err.status) {
                res.status(err.status).json({ status: err.status, data: null, message: err.message })
            }
            res.status(500).json({ status: 500, data: null, message: err.message })
        })
})

module.exports = router