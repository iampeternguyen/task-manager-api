const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Please use valid email');
				}
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 8,
		},
	},
	{ timestamps: true }
);

userSchema.pre('save', async function(next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userSchema.methods.toJSON = function() {
	const dupUser = this.toObject();
	delete dupUser.password;
	return dupUser;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
