require('mongoose');

const messageSchema = new mongoose.Schema({ from: String, to: String, text: String, createdAt: { type: Date, default: Date.now } });

module.exports = mongoose.model('Message', messageSchema);
