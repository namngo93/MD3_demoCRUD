const homeHandleRouter = require('./handleRouter/HomehandleRouter')
const router = {
    'home': homeHandleRouter.showHome,
    'create': homeHandleRouter.createProduct,
    'delete': homeHandleRouter.deleteProduct,
    'edit': homeHandleRouter.editProduct,
}
module.exports = router

