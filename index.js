const express = require ('express');
const res = require('express/lib/response');

const app = express()
const port = 3000


// app.get('/',  (req,  res) => {
//     res.send(' Magic World')
// })

const isLogin = true

const projects = []


app.set('view engine', 'hbs');  // view engine

app.use('/public', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

app.get('/home', (req, res) => {
  const newProject = projects.map((project) => {
    project.isLogin = isLogin
   
    
    return project
  })
  
  res.render('home', {isLogin: isLogin, projects: newProject});
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/addProject', (req,res) => {
    res.render('addProject')
})

app.post('/addProject', (req, res) => {
  const data = req.body;
  projects.push(data)

  res.redirect('/home');
});

app.get('/home/delete/:id',(req,res)=>{
  projects.splice(req.params.id,1);
  res.redirect('/home');
})



app.get('/detail/:index', (req, res) => {
  const index = req.params.index;

  const project = projects[index]

  res.render('detail', { data: index, project});
});


app.get('/contact', (req, res) => {
  res.render('contact');
});




app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
  });

 
  