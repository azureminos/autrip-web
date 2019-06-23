import mongoose from 'mongoose';

const url = process.env.MONGO_URI;
mongoose.connect(url, { useNewUrlParser: true });

export default mongoose;
