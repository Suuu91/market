const prisma = require("../prisma")
const {faker} = require("@faker-js/faker")

const seed = async(productLength = 20) => {
  const products = Array.from({length: productLength}, () => ({
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price()
  }))
  await prisma.product.createMany({data: products})
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });