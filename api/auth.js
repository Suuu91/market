const router = require("express").Router()

const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET
const createToken = (id) => {
  return jwt.sign({id}, JWT_SECRET, {expiresIn: "1d"})
}

const prisma = require("../prisma")

router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.slice(7)
  if(!token) return next()

  try {
    const {id} = jwt.verify(tokenn, JWT_SECRET)
    const user = await prisma.user.findUniqueOrThrow({where: {id}})
    req.user = user
  } catch (error) {
    next(error)
  }
})

router.post("/register", async (req, res, next) => {
  const {username, password} = req.body
  try {
    const userToRegister = await prisma.user.register(username, password)
    const token = createToken(userToRegister.id)
    res.status(201).json({token})
  } catch (error) {
    next(error)
  }
})

router.post("/login", async(req, res, next) => {
  const {username, password} = req.body
  try {
    const userToLogin = await prisma.user.login(username, password)
    const token = createToken(userToLogin.id)
    res.json({token})
  } catch (error) {
    next(error)
  }
})

const authenticate = () => {
  if(req.user) {
    next()
  } else {
    next({status: 401, message: "You must be logged in"})
  }
}

module.exports = {
  router,
  authenticate
}