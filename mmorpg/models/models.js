var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
// define the schema for our user model
var userSchema = new mongoose.Schema({
        user: {
            suid: { type: String, default: "" },
            name: { type: String, default: "" },
            email: { type: String, default: "" },
            password: { type: String, default: "" },
            group: { type: String, default: "user" }
        },
        player: {
            name: { type: String, default: "" },
            xCoord: { type: Number, default: 0 },
            yCoord: { type: Number, default: 0 },
            world: { type: String, default: "Home" },
 
            health: { type: Number, default: 100 },
            mana: { type: Number, default: 100 },
            equipt: { type: [String], default: ["rock", "none", "none", "none", "none", "none"] },
            inventory: { type: [String], default: ["none", "sword", "none", "none", "none", "none", "none", "none"] }
        }
    })
    // generating a hash
userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    }
    // checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.private.password);
}
var User = mongoose.model('User', userSchema);
module.exports = {
    User: User
};
