const authRouter = require('./auth.js');

const initRoutes = (app) => {
    app.use('/api/v1/auth', authRouter)

    return app.use('/', (req, res) => {
        res.send('server on...')

    })
}

module.exports = initRoutes;