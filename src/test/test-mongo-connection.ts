import mongoose from 'mongoose';

const uri = 'mongodb://admin:pass@localhost:27017';

mongoose
  .connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });
