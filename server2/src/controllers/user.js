const userService = require('../services/user');

const getCurrent = async (req, res ) => {
    const { id } = req.user
    try {
        const respone = await userService.getOne(id)
        return res.status(200).json(respone)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller : ' + error,
        })
    }
}

module.exports = {
    getCurrent,
};
