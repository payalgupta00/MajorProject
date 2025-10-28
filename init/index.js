const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");  // <-- fixed path

const MONGO_URL = "mongodb://127.0.0.1:27017/WanderLust";

main().then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj) => ({
        ...obj, owner: "68f0ce6c354cc15b861dad0f"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();
