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

//delete blog
app.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    deleteBlog(id);
    res.sendStatus(204);
});

// Edit blog post
app.get('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const blog = blogList.find(blog => blog.id === id);
    if (!blog) {
        res.status(404).send('Blog post not found.');
        return; 
    }
    res.render('edit.ejs', { blog });
});

// Handle edit form submission
app.post('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;
    const index = blogList.findIndex(blog => blog.id === id);
    if (index !== -1) {
        blogList[index].title = title;
        blogList[index].content = content;
        res.redirect('/');
    } else {
        res.status(404).send('Blog post not found.');
    }
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
