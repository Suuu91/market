const router = require("express").Router()
module.exports = router

const prisma = require("../prisma")

router.get("/", async (req, res, next) => {
  try {
    const allProducts = await prisma.product.findMany()
    res.json(allProducts)
  } catch (error) {
    next(error)
  }
})

router.get("/:id", async (req, res, next) => {
  const {id} = req.params
  const foundProduct = await prisma.product.findUniqueOrThrow({
    where: {id: +id}
  })
  res.json(foundProduct)
})
