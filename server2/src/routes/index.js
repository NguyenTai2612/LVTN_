const authRouter = require('./auth.js');
const categoryRouter = require('./category.js')
const productRouter = require('./product.js')


const initRoutes = (app) => {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/category', categoryRouter)
    app.use('/api/v1/product', productRouter)

    return app.use('/', (req, res) => {
        res.send('server on...')

    })
}

module.exports = initRoutes;