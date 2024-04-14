import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let blogList = [];

function deleteBlog(id) {
    blogList = blogList.filter(blog => blog.id !== id);
}

app.post('/add-blog', (req, res) => {
    const { title, content } = req.body;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    const newBlog = {
        id: blogList.length + 1,
        title,
        content,
        createdOn: formattedDate,
    };

    blogList.push(newBlog);
    console.log(req.body);
    res.redirect('/');
});

app.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    deleteBlog(id);
    res.sendStatus(204);
});

// the blog creation page
app.get('/form', (req, res) => {
    res.render("form.ejs", {
        blogs: blogList,
    });
});

// the home page
app.get('/', (req, res) => {
    res.render("index.ejs", {
        blogs: blogList,
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
