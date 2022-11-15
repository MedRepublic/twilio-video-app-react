import fs, { writeFileSync } from 'fs'
import path from 'path';

const getNewId = (array) => {
    if (array.length > 0) {
        return array[array.length - 1].id + 1
    } else {
        return 1
    }
}
const newDate = () => new Date().toString()
function mustBeInArray(array, id) {
    return new Promise((resolve, reject) => {
        const row = array.find(r => r.id == id)
        if (!row) {
            reject({
                message: 'ID is not good',
                status: 404
            })
        }
        resolve(row)
    })
}

function roomNameAndUserName(array, roomName, userName) {
    return new Promise((resolve, reject) => {
        const row = array.find(r => r.roomName == roomName && r.userName == userName)
        if (!row) {
            resolve({
                message: 'room and user is not found',
                status: 200,
                data:null
            })
        }
        resolve({
            message: 'room and user is already exist',
            status: 200,
            data:row
        })
    })
}
async function writeJSONFile(filename, content) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path.resolve(__dirname, filename))) {
            fs.mkdirSync(path.resolve(__dirname, filename), { recursive: true });
        }
        writeFileSync(path.resolve(__dirname, filename), JSON.stringify(content), 'utf8', (err) => {
            reject({
                message: err,
                status: 400
            })
        })
        resolve()
    })
    // console.log(fs.existsSync(filename))

}
export default {
    getNewId,
    newDate,
    mustBeInArray,
    roomNameAndUserName,
    writeJSONFile
}