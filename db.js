const { connect } = require("mongoose");
require("dotenv").config();

async function connectToDb() {
  await connect(process.env.MONGO_URL).then(
    () => console.log("MongoDB Conected Successfully"),
    (err) => console.log(err)
  );
}

module.exports = connectToDb;
