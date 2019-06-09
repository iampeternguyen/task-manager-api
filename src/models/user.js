const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
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
		projects: [
			{
				project: {
					type: mongoose.Schema.ObjectId,
					ref: 'Project',
				},
			},
		],
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
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

userSchema.methods.generateAuthToken = async function() {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};
userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner',
});

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error();
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (isMatch) {
		return user;
	} else {
		throw new Error();
	}
};

const User = mongoose.model('User', userSchema);

module.exports = User;
