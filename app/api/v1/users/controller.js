const getAllUsers= async(req, res, next)=>{
    try {
        res.send('respond with a resource');
    } catch (err) {
        next(err)
    }
}

module.exports = {getAllUsers}