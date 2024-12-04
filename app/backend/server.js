/**
 * This file uses express app to provide user related routes
 * @author Novangeline Santoso
 * @requires express
 * @requires ejs
 * @requires Driver
 * @requires Package
 */

/**
 * Import driver schema
 * @const
 */
const Driver = require('./models/driver');

/**
 * Import package schema
 * @const
 */
const Package = require('./models/package');

/**
 * Import firebase operations
 * @const
 */
const { db, initializeDocument, incrementCounter, getData} = require('./firebase');

/** express module
 * @const
 */
const express = require("express");

/**
 * mongoose module
 * @const
 */
const mongoose = require("mongoose");

/**
 * fs module for text 2 speech
 * @const
 */
const fs = require("fs");

/**
 * uuid module
 * @const
 */
const { v4: uuidv4 } = require('uuid');

/**
 * Google gemini module
 * @const
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**app instance
 * @const
*/
const app = express(); 

/**
 * import socket io module
 * @const
 */
const { Server } = require('socket.io');

/**
 * import http module
 * @const
 */
const http = require('http');

/**
 * create server instance
 * @const
 */
const server = http.createServer(app);

/**
 * create new pool of clients
 */
const io = new Server(server);

/**
 * Import the Google Cloud client library, text to speech
 * @const
 */
const textToSpeech = require("@google-cloud/text-to-speech");

/**
 * Import the google cloud client library, translate
 * @const
 */
const { Translate } = require('@google-cloud/translate').v2;

/**
 * Creates a client
 * @const
 */
const client = new textToSpeech.TextToSpeechClient();

/**
 * Create instance of translate
 * @const
 */
const translate = new Translate();

/**
 * the port number
 * @const
 */
const PORT_NUMBER = 8080;

/**
 * url to connect to the database
 * @const
 */
const url = "mongodb://localhost:27017/app";

/**
 * gemini api key
 * @const
 */
const gemini_api_key = "secret-key";

/**
 * Middleware to serve static file
 * Serves the built dist folder that's ready for production
 */
app.use(express.static('../dist/app/browser'))

/**
 * Middleware to serve json
 */
app.use(express.json());

/**
 * Listens to this port number
 */
server.listen(PORT_NUMBER, () => {
    console.log(`Server running at: http://localhost:${PORT_NUMBER}`);
});

/**
 * Connect to the database
 * @param {*} url 
 * @returns message
 */
async function connectDB(url) {
    await mongoose.connect(url);
    return ('Connected Successfully');
}

/**
 * Catch error if the connection fails
 */
connectDB(url)
    .then(async () => {
        console.log('MongoDB connected');
        await initializeDocument();  // Initialize Firestore document once
        console.log('Firestore document initialized');
    })
    .catch((err) => console.log(err));

/**
 * Wait for connection
 */ 
io.on("connection", (socket) => {
    console.log("new connection made");

    socket.on('translateEvent', async ({language, description}) => {
        console.log(language, description);

        // Call Google Translate API
        const [translation] = await translate.translate(description, language);
        console.log(`Translation: ${translation}`);

        // Send the translated text back to the frontend
        socket.emit('translateServerEvent', { description, language, translation });
    })

    socket.on('genAIevent', async (destination) => {
        console.log(destination);
        const result = await geminiModel.generateContent(`Calculate the approximate distance from Melbourne to ${destination} in this format "Approximately {x} kilometers ({y} miles)`);
        const candidate = result.response.candidates[0];

        // Extract the generated message from 'content.parts'
        const message = candidate.content.parts[0].text;

        socket.emit('genAIserverEvent', message);
    });

    socket.on('text2speechEvent', async (licence) => {
        console.log(licence)
        /**
         * Construct the request
         */
        const request = {
            input: { text: licence },
            // Select the language and SSML Voice Gender (optional)
            voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
            // Select the type of audio encoding
            audioConfig: { audioEncoding: "MP3" },
        };
        
        // create random filename
        const filename = `${uuidv4()}.mp3`;

        // Performs the Text-to-Speech request
        client.synthesizeSpeech(request, (err, response) => {
            if (err) {
                console.error("ERROR:", err);
                return;
            }
            // Write the binary audio content to a local file
            fs.writeFile(filename, response.audioContent, "binary", err => {
                if (err) {
                    console.error("ERROR:", err);
                    return;
                }
                console.log(`Audio content written to file: ${filename}`);
                socket.emit('text2speechServerEvent', { file: response.audioContent });
            });
        });
    })
})

/**
 * create instance of the AI
 */
const googleAI = new GoogleGenerativeAI(gemini_api_key);

/**
 * configurations for the AI
 */
const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
};

/**
 * gets the AI model
 */
const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-pro",
    geminiConfig,
});

/** RESTful API endpoints */

/**
 * Route to handle add driver using api
 * @name post/
 * @function
 * @param path Express path
 * @param callback Express callback
 */
app.post("/api/drivers/add", async function (req, res) {
    try {
        let aDriver = req.body;
        let driverDoc = new Driver({
            driver_name: aDriver.driver_name,
            driver_department: aDriver.driver_department,
            driver_licence: aDriver.driver_licence,
            driver_isActive: aDriver.driver_isActive
        })
        await driverDoc.save();
        incrementCounter("insert");
        res.status(200).json({
            "id": driverDoc._id,
            "driver_id": driverDoc.driver_id
        })
    } catch (error) {
        return res.status(400).json({ message: 'Invalid data'});
    }
});

/**
 * Route to handle get drivers using api
 * @name get/
 * @function
 * @param path Express path
 * @param callback Express callback
 */
app.get("/api/drivers", async function (req, res) {
    let drivers = await Driver.find({}).populate('assigned_packages');
    incrementCounter("retrieve");
    res.status(200).json(drivers);
});

/**
 * Route to handle delete driver using api
 * @name delete/
 * @function
 * @param path Express path
 * @param callback Express callback
 */
app.delete("/api/drivers/delete/:id", async function (req, res) {
    try {
        let id = req.params.id;
        let driver = await Driver.findById(id);
        let driverDeleteResult = await Driver.deleteOne({ _id: id });
        await Package.deleteMany({
            _id: { $in: driver.assigned_packages }
        });
        incrementCounter("delete");
        res.status(200).json({
            "acknowledged": driverDeleteResult.acknowledged,
            "deletedCount": driverDeleteResult.deletedCount
        });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid data'});
    }
});

/**
 * Route to handle update driver using api
 * @name put/
 * @function
 * @param path Express path
 * @param callback Express callback
 */
app.put("/api/drivers/update", async function (req, res) {
    try {
        let id = req.body.id;
        let newLicence = req.body.driver_licence;
        let newDepartment = req.body.driver_department;
        let updateDriver = await Driver.updateOne( 
            {_id: id}, 
            { $set:
                {
                    driver_licence: newLicence, 
                    driver_department: newDepartment
                }
            }, { runValidators: true }
        );
        if (!updateDriver.matchedCount) {
            res.status(400).json({
                status: "ID not found"
            })
        }
        else {
            incrementCounter("update");
            res.status(200).json({
                status: "Driver updated successfully"
            })
        }
    } catch (error) {
        return res.status(400).json({ message: 'Invalid data'});
    }
});

/**
 * Route to handle add package using api
 * @name post/
 * @function
 * @param path Express path
 * @param callback Express callback
 */
app.post("/api/packages/add", async function (req, res) {
    try {
        console.log(req.body)
        let aPackage = req.body;
        let packageDoc = new Package({
            package_title: aPackage.package_title,
            package_weight: aPackage.package_weight,
            package_destination: aPackage.package_destination,
            description: aPackage.description,
            isAllocated: aPackage.isAllocated,
            driver_id: new mongoose.Types.ObjectId(aPackage.driver_id)
        })
        await packageDoc.save();

        let packageId = packageDoc._id;
        let driverId = packageDoc.driver_id;
        let theDriver = await Driver.findById({_id: driverId});
        theDriver.assigned_packages.push(packageId);
        await theDriver.save();

        incrementCounter("insert");

        res.status(200).json({
            "id": packageDoc._id,
            "package_id": packageDoc.package_id
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Invalid data'});
    }
});

/**
 * Route to handle get packages using api
 * @name get/
 * @function
 * @param path Express path
 * @param callback Express callback
 */
app.get("/api/packages", async function (req, res) {
    let packages = await Package.find({});
    incrementCounter("retrieve");
    res.status(200).json(packages);
});

/**
 * Route to handle delete package using api
 * @name delete/
 * @function
 * @param path Express path
 * @param callback Express callback
 */
app.delete("/api/packages/delete/:id", async function (req, res) {
    try {
        let id = req.params.id;
        let packageDeleteResult = await Package.deleteOne({ _id: id });
        await Driver.updateMany(
            { assigned_packages: id }, 
            { $pull: { assigned_packages: id } } 
        );
        incrementCounter("delete");
        res.status(200).json({
            acknowledged: packageDeleteResult.acknowledged,
            deletedCount: packageDeleteResult.deletedCount
        });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid data'});
    }
});

/**
 * Route to handle update package using api
 * @name post/
 * @function
 * @param path Express path
 * @param callback Express callback
 */
app.put("/api/packages/update", async function (req, res) {
    try {
        let id = req.body.id;
        console.log(id)
        let newDestination = req.body.package_destination;
        let updatePackage = await Package.updateOne( 
            {_id: id}, 
            { $set: {'package_destination': newDestination} },
            { runValidators: true }
        );
        if (!updatePackage.matchedCount) {
            res.status(400).json({
                status: "ID not found"
            })
        }
        else {
            incrementCounter("update");
            res.status(200).json({
                status: "updated successfully"
            })
        }
    } catch (error) {
        return res.status(400).json({ message: 'Invalid data'});
    }
});

/**
 * Route to handle stats
 * @name get/
 * @function
 * @param path Express path
 * @param callback Express callback
 */
app.get("/api/stats", async function (req, res) {
    const data = await getData();
    let driversCount = await Driver.countDocuments();
    let packagesCount = await Package.countDocuments();
    let operations = Object.keys(data);
    let counts = Object.values(data);
    res.status(200).json({driversCount, packagesCount, operations, counts});
});

/**
 * Route to handle signup using api
 * @name post/
 * @function
 * @param path Express path
 * @param callback Express callback
 */
app.post('/api/signup', async (req, res) => {
  
    let username = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    // Validate username and password
    if (!(/^[a-zA-Z0-9]{6,}$/).test(username) || password.length < 5 || password.length > 10 || password !== confirmPassword) {
        return res.status(400).json({ message: 'Invalid data'});
    }

    // Check if the username already exists in Firestore
    const userDoc = db.collection('users').doc(username);
    const userSnapshot = await userDoc.get();

    if (userSnapshot.exists) {
        return res.status(400).json({ message: 'User already exists'});    
    }

    else {
        await userDoc.set({
            username: username,
            password: password 
        });
    }

    return res.status(200).json({message: 'Sign Up Successful'})
});

/**
 * Route to handle login using api
 * @name post/
 * @function
 * @param path Express path
 * @param callback Express callback
 */
app.post('/api/login', async (req, res) => { 
    let username = req.body.username;
    let password = req.body.password;

    let userDoc = db.collection('users').doc(username);
    let userSnapshot = await userDoc.get();

    // Check if the username exists in Firestore
    if (!userSnapshot.exists || userSnapshot.data().password !== password) {
        return res.status(400).json({ message: 'Invalid data'});
    }
    else {
        return res.status(200).json({message: 'Login Successful'})
    }
});