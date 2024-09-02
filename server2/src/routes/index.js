const authRouter = require('./auth.js');
const categoryRouter = require('./category.js')
const productRouter = require('./product.js')
const productImageRouter = require('./productImage.js');
const productSpecificationRouter = require('./productSpecification.js');
const reviewRouter = require('./review.js');
const userRouter = require('./user.js');
const cartRouter = require('./cart.js');

const initRoutes = (app) => {
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/category', categoryRouter)
    app.use('/api/v1/product', productRouter)
    app.use('/api/v1/product', productRouter)
    app.use('/api/v1/productImage', productImageRouter)
    app.use('/api/v1/productSpecification', productSpecificationRouter)
    app.use('/api/v1/review', reviewRouter); 
    app.use('/api/v1/user', userRouter); 
    app.use('/api/v1/cart', cartRouter);

    return app.use('/', (req, res) => {
        res.send('server on...')

    })
}

module.exports = initRoutes;