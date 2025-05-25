import mongoose, { model, Schema } from "mongoose";
const testSchema=new Schema({
  title: {type:String },
  questions: [ {
                 questionText:{type:String,require:true},
                 options: [{type:String,require:true}],
                 correctAnswer:{type:String,require:true},
  }],
  
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'lessons' }
  })
const lessonSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course" },

  tests: [testSchema]
});
const courseSchema = new Schema({
  title: { type: String },
  description: { type: String },
  //  createdBy:
  //   enrolledUsers: [{
  //                               userId:{}
  //                                enrollmentDate:
  //                                 }],
  createdAt: { type: Date, default: new Date() },
  lessons: [lessonSchema],
});
const courseModel = new model("course", courseSchema);
export default courseModel;
