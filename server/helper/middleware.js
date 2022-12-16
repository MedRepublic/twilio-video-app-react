function mustBeInteger(req, res, next) {
    const id = req.params.id;
    if (!Number.isInteger(parseInt(id))) {
        res.status(400).json({ message: 'ID must be an integer' })
    } else {
        next()
    }
}

function checkFieldsPost(req, res, next) {
    const { room, name, inRoomAdded=false } = req.body;
    if (room && name) {
        next()
    } else {
        res.status(400).json({ message: 'fields are not good' })
    }
}

export default {
    mustBeInteger,
    checkFieldsPost
}