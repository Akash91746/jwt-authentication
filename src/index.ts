import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';
import app from "./app";

const port = process.env.SERVER_PORT || 4000;

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

mongoose.connect(process.env.DATABASE!!)
    .then(() => {
        console.log("MongoDB connnection established");    
    }
);

export default server;