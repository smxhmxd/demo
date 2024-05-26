

import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);

const uniqueSchema = new mongoose.Schema({
    name: String,
    phone: String
});
const duplicateSchema = new mongoose.Schema({
    name: String,
    phone: String
});

const Unique = mongoose.model('Unique', uniqueSchema);
const Duplicate = mongoose.model('Duplicate', duplicateSchema);

// Upload and Process Excel File
app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(`Data ${data}`);

    data.map((obj) => {console.log(obj)})

    const uniqueData = new Map();
    const duplicateData = [];

    for (const row of data) {
        const { name, phone } = row;
        console.log(`row ${row}`);
        if (uniqueData.has(phone)) {
            duplicateData.push({ name, phone });
            console.log(`dup...  ${name,phone}`);
        } else {
            uniqueData.set(phone, { name, phone });
        }
    }

    const uniqueArray = Array.from(uniqueData.values());

    // Save unique and duplicate data to MongoDB
    await Unique.insertMany(uniqueArray);
    await Duplicate.insertMany(duplicateData);

    console.log(uniqueArray);
    console.log("kjdsbvjk");
    console.log(duplicateData);

    // Create new workbook with unique and duplicate data
    const newWorkbook = xlsx.utils.book_new();
    const uniqueSheet = xlsx.utils.json_to_sheet(uniqueArray);
    const duplicateSheet = xlsx.utils.json_to_sheet(duplicateData);

    xlsx.utils.book_append_sheet(newWorkbook, uniqueSheet, 'Unique Data');
    xlsx.utils.book_append_sheet(newWorkbook, duplicateSheet, 'Duplicate Data');

    const newFilePath = path.join("./public", 'output.xlsx');
    xlsx.writeFile(newWorkbook, newFilePath);

    res.download(newFilePath, 'output.xlsx', (err) => {
        if (err) {
            console.error('File download failed:', err);
        }
        // fs.unlinkSync(filePath); // Delete the uploaded file
        // fs.unlinkSync(newFilePath); // Delete the generated file
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
