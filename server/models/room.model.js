import rooms from '../data/rooms.json'
import helper from '../helper/helper'
const filename = '../data/rooms.json'

function getRooms() {
    return new Promise((resolve, reject) => {
        if (rooms.length === 0) {
            reject({
                message: 'no rooms available',
                status: 202
            })
        }
        resolve(rooms)
    })
}

function getRoom(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(rooms, id)
            .then(room => resolve(room))
            .catch(err => reject(err))
    })
}

function getRoomByName(roomName) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArrayName(rooms, roomName)
            .then(room => resolve(room))
            .catch(err => reject(err))
    })
}


function getRoomByRoomAndName(roomName, userName) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArrayRoomAndName(rooms, roomName, userName)
            .then(room => resolve(room))
            .catch(err => reject(err))
    })
}
function insertRoom(newRoom) {
    return new Promise((resolve, reject) => {
        helper.roomNameAndUserName(rooms, newRoom.room, newRoom.name)
            .then(room => {
                if (room.data) {
                    resolve(room.data)
                } else {
                    const id = { id: helper.getNewId(rooms) }
                    const date = {
                        createdAt: helper.newDate(),
                        updatedAt: helper.newDate()
                    }
                    newRoom = { ...id, ...date, ...newRoom }
                    rooms.push(newRoom)
                    helper.writeJSONFile(filename, rooms)
                    resolve(newRoom)
                }
            })
            .catch(err => reject(err));
    })
}

function updateRoom(id, newRoom) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(rooms, id)
            .then(room => {
                const index = rooms.findIndex(p => p.id == room.id)
                id = { id: room.id }
                const date = {
                    createdAt: room.createdAt,
                    updatedAt: helper.newDate()
                }
                rooms[index] = { ...id, ...date, ...newRoom }
                helper.writeJSONFile(filename, rooms)
                resolve(rooms[index])
            })
            .catch(err => reject(err))
    })
}

function deleteRoom(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(rooms, id)
            .then(() => {
                rooms = rooms.filter(p => p.id != id);
                helper.writeJSONFile(filename, rooms)
                resolve()
            })
            .catch(err => reject(err))
    })
}

export default {
    insertRoom,
    getRooms,
    getRoom,
    getRoomByName,
    getRoomByRoomAndName,
    updateRoom,
    deleteRoom
}