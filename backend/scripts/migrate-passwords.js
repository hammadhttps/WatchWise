import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  securityQuestions: [{
    question: String,
    answer: String
  }]
});

const User = mongoose.model('User', userSchema);

const isHashed = (password) => {
  if (!password) return false;
  if (password.startsWith('$2')) return true;
  return false;
};

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    let migrated = 0;
    let alreadyHashed = 0;

    for (const user of users) {
      if (isHashed(user.password)) {
        alreadyHashed++;
        continue;
      }

      console.log(`Migrating user: ${user.email}`);

      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);

      const sqSalt = await bcrypt.genSalt(12);
      for (let i = 0; i < user.securityQuestions.length; i++) {
        if (user.securityQuestions[i].answer) {
          user.securityQuestions[i].answer = await bcrypt.hash(
            user.securityQuestions[i].answer.toLowerCase().trim(),
            sqSalt
          );
        }
      }

      await user.save();
      migrated++;
    }

    console.log(`\nMigration complete!`);
    console.log(`- Already hashed: ${alreadyHashed}`);
    console.log(`- Migrated: ${migrated}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

migrate();
