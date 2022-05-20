const express = require ('express');

const app = express()
const port = 3000

// app.get('/',  (req,  res) => {
//     res.send(' Magic World')
// })


app.set('view engine', 'hbs'); //setup template engine / view engine

app.use('/public', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/addProject', (req,res) => {
    res.render('addProject')
})

app.post('/addProject', (req, res) => {
  const data = req.body;
  console.log(data);

  res.redirect('/contact');
});


app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/detail', (req, res) => {
  const index = req.params.index;

  res.render('detail', { data: index, number: '2022' });
});



app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
  });