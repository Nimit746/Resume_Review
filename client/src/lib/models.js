import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled Resume' },
  publicId: { type: String, unique: true, sparse: true, default: () => Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11) },
  data: { type: Object, default: {} },
  views: { type: Number, default: 0 },
  atsScore: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const QuestionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const CoverLetterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  title: { type: String, default: 'Untitled Cover Letter' },
  content: { type: String, default: '' },
  jobDescription: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Resume = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
export const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
export const CoverLetter = mongoose.models.CoverLetter || mongoose.model('CoverLetter', CoverLetterSchema);
