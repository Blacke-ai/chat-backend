require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// ربط MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chatapp', {
useNewUrlParser: true,
useUnifiedTopology: true
});

app.use(express.json());

// تسجيل مستخدم جديد
app.post('/register', async (req, res) => {
const { username } = req.body;
const user = new User({ username });
await user.save();
res.send(user);
});

// الحصول على كل المستخدمين
app.get('/users', async (req, res) => {
const users = await User.find();
res.send(users);
});

// Socket.io للرسائل اللحظية
io.on('connection', (socket) => {
console.log('User connected:', socket.id);

socket.on('sendMessage', async ({ from, to, text }) => {
const message = new Message({ from, to, text });
await message.save();
io.emit('receiveMessage', message);
});

socket.on('disconnect', () => {
console.log('User disconnected:', socket.id);
});
});

server.listen(3000, () => console.log('Server running on port 3000'));
