// import fs from "fs";
const fs = require("fs")

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;

}


function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

}


function randomDate(start, end) {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];

}


const categories = [
  "Electronics",
  "Computers",
  "Audio",
  "Wearables",
  "Gaming",
  "Home Entertainment",
  "Home Automation",

];

const states = ["CA", "NY", "TX", "FL", "NV"];

const storeIds = [
  "Store001",
  "Store002",
  "Store003",
  "Store004",
  "Store005",
  "Store006",
  "Store007",

];

const tags = [
  "smartphone",
  "electronics",
  "gadgets",
  "laptop",
  "computers",
  "technology",
  "headphones",
  "audio",
  "wireless",
  "smartwatch",
  "wearables",
  "fitness",
  "gaming",
  "console",
  "entertainment",
  "tv",
  "home entertainment",
  "4K",
  "speaker",
  "bluetooth",
  "tablet",
  "tracker",
  "smart home",
  "hub",

];


const products = [];


for (let i = 1; i <= 100000; i++) {
  const product = {
    name: `Product ${i}`,
    category: categories[randomInt(0, categories.length - 1)],
    price: randomFloat(10000, 1500000),
    specifications: {
      processor: `${
        ["Dual-core", "Quad-core", "Octa-core"][randomInt(0, 2)]
      } ${randomFloat(1.5, 3.5, 1)} GHz`,
      ram: `${[2, 4, 6, 8, 16, 32][randomInt(0, 5)]}GB`,
      storage: `${[32, 64, 128, 256, 512, 1024][randomInt(0, 5)]}GB`,
      camera: {
        front: `${randomInt(5, 32)}MP`,
        rear: `${randomInt(10, 64)}MP`,
      },
      battery: `${randomInt(2000, 6000)}mAh`,
    },
    availability: {
      online: true,
      in_store: Array.from(
        { length: randomInt(1, 5) },
        () => storeIds[randomInt(0, storeIds.length - 1)]
      ),
    },
    ratings: Array.from({ length: randomInt(1, 5) }, () => ({
      user_id: `U${randomInt(1, 50).toString().padStart(3, "0")}`,
      rating: randomInt(1, 5),
      comment: "Sample comment",
    })),
    supplier: {
      name: `Supplier ${randomInt(1, 20)} Inc.`,
      contact: {
        phone: `${randomInt(100, 999)}-${randomInt(100, 999)}-${randomInt(
          1000,
          9999
        )}`,
        email: `info@supplier${randomInt(1, 20)}.com`,
      },
      address: {
        street: `${randomInt(100, 999)} Supplier St`,
        city: `City ${randomInt(1, 20)}`,
        state: states[randomInt(0, states.length - 1)],
        zip: `${randomInt(10000, 99999)}`,
      },
    },
    manufacture_date: randomDate(new Date(2022, 0, 1), new Date(2023, 11, 31)),
    warranty_period: `${randomInt(12, 36)} months`,
    tags: Array.from({ length: 3 }, () => tags[randomInt(0, tags.length - 1)]),
  };
  products.push(product);

}


// Convert to JSON

const jsonData = JSON.stringify(products, null, 4);


// Write to a file

fs.writeFile("products.json", jsonData, (err) => {
  if (err) throw err;
  console.log("Data written to file");

});