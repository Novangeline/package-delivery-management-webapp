/**
 * Import firebase-admin
 * @const
 */
const admin = require("firebase-admin");

/**
 * Get a reference to the private key
 * @const
 */
const serviceAccount = require("./service-account.json");

/**
 * Initialize access to Firebase
 */
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

/**
 * Access Firestore database
 */
const db = admin.firestore();

/**
 * Initialize the Firestore document with default values if it doesn't exist.
 * @async
 * @function initializeDocument
 */
async function initializeDocument() {
    const docRef = db.collection('data').doc('stats');
    const docSnapshot = await docRef.get();

    // Check if the document exists
    if (!docSnapshot.exists) {
        // Initialize the document with default values
        await docRef.set({
            delete: 0,
            insert: 0,
            retrieve: 0,
            update: 0
        });
        console.log('Document initialized with default values');
    } else {
        console.log('Document already exists');
    }
}

/**
 * Increment the counter for a specific operation and save the updated value in Firestore.
 * @async
 * @function incrementCounter
 * @param operation - The crud operation to increment
 */
async function incrementCounter(operation) {
    // Get the current document from Firestore
    // Gets reference to 'stats'
    const docRef = await db.collection('data').doc('stats');
    // Fetch the snapshot which includes metadata and the actual data
    const docSnapshot = await docRef.get();

    // Get the current data from the document
    // Extract the actual data
    const data = docSnapshot.data();

    // Increment the operation count by 1 and update the Firestore document
    await docRef.update({
        [operation]: data[operation] + 1 
    });
}

/**
 * Get data from firestore
 * @async
 * @function getData
 * @returns data
 */
async function getData() {
    const docRef = db.collection('data').doc('stats');  
    const docSnapshot = await docRef.get();  

    if (docSnapshot.exists) {
        return docSnapshot.data(); 
    } else {
        console.log('No stats document found');
        return {}; 
    }
}

/**
 *  Export Firestore functions and db
 */ 
module.exports = { db, initializeDocument, incrementCounter, getData };
