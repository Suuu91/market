const router = require("express").Router()
const {authenticate} = require("./auth")
const prisma = require("../prisma")
module.exports = router

router.get("/", authenticate, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: {customerId: req.user.id}
    })
    res.json(orders)
  } catch (error) {
    next(error)
  }
})

router.post("/", authenticate, async(req, res, next) => {
  const {date, note, productId} = req.body
  try {
    const products = productId.map((id) => ({id}))
    const order = await prisma.order.create({
      data: {
        date,
        note,
        customerId: req.user.id,
        items:{connect: products}
      }
    })
    res.status(201).json(order)
  } catch (error) {
    next(error)
  }
})

router.get("/:id", authenticate, async (req, res, next) => {
  const {id} = req.params
  try {
    const order = await prisma.ordder.findUniqueOrThrow({
      where:{id: +id},
      include: {items: true}
    })
    if(order.customerId !== req.user.id){
      next({status: 403, message: "You do not own this order"})
    }
    res.json(order)
  } catch (error) {
    next(error)
  }
})