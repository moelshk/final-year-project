import express from 'express';
const app = express();
import userRoutes from './routes/users.js';
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';


//middleware routes
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);


app.listen(8800, () => {
    console.log('Server is running on port 8800')
});