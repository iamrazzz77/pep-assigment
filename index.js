import express from "express"
import mongoose from "mongoose"

const app = express();
app.use(express.json());


mongoose.connect("mongodb+srv://user123:fsk123@cluster0.wtuajvy.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Failed to connect to MongoDB:', error));


const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);


app.get('/todo', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json("Server error");
  }
});

app.get('/todo/:id', async (req, res) => {
    try {
      const todos = await Todo.find();
      const todo = todos.find(todo => todo._id.toString() === req.params.id);
      res.json(todo);
    } catch (error) {
      res.status(404).json("ID not found");
    }
  });

app.post('/todo', async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = new Todo({
      title,
      description,
      status: false,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json("Unable to create on server");
  }
});

app.put('/todo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const todo = await Todo.findByIdAndUpdate(id, {
      title,
      description,
      status,
    });
    res.json(todo);
  } catch (error) {
    res.status(404).json("Id not found");
  }
});

app.delete('/todo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(404).json("Id not found");
  }
});

app.get('/', (req, res) => {
    res.send('Backend working');
    res.end();
}
)

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});