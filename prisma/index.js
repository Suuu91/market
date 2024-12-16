const bcrypt = require("bcrypt")
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async register(username, password) {
        const hashedpassword = await bcrypt.hash(password, 10)
        const userToCreate = await prisma.user.create({
          data: {username, password: hashedpassword}
        })
      return userToCreate
      },
      async login(username, password) {
        const userToLogin = await prisma.user.findUniqueOrThrow({
          where: {username}
        })
        const valid = await bcrypt.compare(password, userToLogin.password)
        if (!valid) {throw Error("Invalid Password")}
        return userToLogin
      }
    }
  }
})
module.exports = prisma;