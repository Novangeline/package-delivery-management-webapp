/**
 * A mongoose schema for package
 */

/**
 * Import mongoose
 */
const mongoose = require('mongoose');
const { validate } = require('mongoose/lib/model');

/**
 * The package schema
 */
const packageSchema = new mongoose.Schema({
    package_id: {
        type: String,
        unique: true,
        default: function () {
            return `P${String.fromCharCode(Math.floor(Math.random() * 26 + 65))}${String.fromCharCode(Math.floor(Math.random() * 26 + 65))}-NS-${Math.floor(Math.random() * 899 + 100)}`
        }
    },
    package_title: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9 ]+$/.test(value) && value.length >= 3 && value.length <= 15;
            },
            message: `Title should be alphanumeric with length within 3 to 15 characters`
        }
    },
    package_weight: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: `Weight should be positive`
        }
    },
    package_destination: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9 ]+$/.test(value) && value.length >= 5 && value.length <= 15;
            },
            message: `Destination should be alphanumeric with length within 5 to 15 characters`
        }
    },
    description: {
        type: String,
        required: false,
        default: "",
        validate: {
            validator: function (value) {
                return value.length >= 0 && value.length <= 30;
            },
            message: `Description should be within 0 to 30 characters`
        }
    },
    createdAt: {
        type: Date,
        default: function () {
            return new Date();
        }
    },
    isAllocated: {
        type: Boolean,
        required: true
    },
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    }
})

/**
 * Export schema
 */
module.exports = mongoose.model('Package', packageSchema);