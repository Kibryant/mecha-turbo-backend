import * as fs from 'fs';
import * as path from 'path';
import userModel from '../lib/db/models/userModel';
import mongoose from 'mongoose';
import { config } from "dotenv";
import * as bcrypt from "bcrypt";

config();

const MONGODB_URI = process.env.MONGODB_URI!;

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
});


const generatePassword = (name: string) => {
    const firstName = name.split(' ')[0].toLowerCase();
    return `${firstName}123456`;
};

const addUsersFromJson = async () => {
    console.log('Adding users from JSON file...');
    const jsonFilePath = path.resolve(__dirname, '../../src/scripts/users.json');
    console.log('Reading file:', jsonFilePath);
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const users = JSON.parse(jsonData);
    const salt = await bcrypt.genSalt(10);

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const password = await bcrypt.hash(generatePassword(user.name), salt);

        const newUser = new userModel({
            name: user.name,
            email: user.email,
            purchaseDate: user.createdAt,
            expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            password
        });

        await newUser.save();
        console.log(`User ${user.name} added!!`);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

addUsersFromJson().then(() => {
    console.log('Success!');
    mongoose.disconnect();
}).catch(err => {
    console.error('Failed:', err);
});
