/**
 * A mongoose schema for driver
 */

/**
 * Import mongoose
 */
const mongoose = require('mongoose');

/**
 * The driver schema
 */
const driverSchema = new mongoose.Schema({
	driver_id: {
        type: String,
        unique: true,
        default: function () {
            return `D${Math.floor(Math.random() * 89 + 10)}-33-${String.fromCharCode(Math.floor(Math.random() * 26 + 65))}${String.fromCharCode(Math.floor(Math.random() * 26 + 65))}${String.fromCharCode(Math.floor(Math.random() * 26 + 65))}`;
        }
    },
	driver_name: {
		type: String,
		required: true,
		validate: {
			validator: function (value) {
				return /^[a-zA-Z ]+$/.test(value) && value.length >= 3 && value.length <= 20;
			},
			message: `Name should contain only alphabets with length within 3 to 20 characters`
		}
	},
	driver_department: {
		type: String,
		required: true,
		enum: ['Food', 'Furniture', 'Electronic'],
    	message: 'Department must be either food, furniture, or electronic'
	},
	driver_licence: {
		type: String,
		required: true,
		validate: {
			validator : function (value) {
				return /^[a-zA-Z0-9]+$/.test(value) && value.length === 5;
			},
			message: `Licence should be alphanumeric and has the length of 5`
		}
	},
	driver_isActive: {
		type: Boolean,
		required: true
	},
	driver_createdAt: {
		type: Date,
		default: function () {
			return new Date();
		}
	},
	assigned_packages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Package",
		},
	],
})

/**
 * Export schema
 */
module.exports = mongoose.model('Driver', driverSchema);
