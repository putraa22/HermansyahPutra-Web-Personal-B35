const express = require ('express');

const db = require ('./db_project/database')

const app = express()
const port = 3000


// app.get('/',  (req,  res) => {
//     res.send(' Magic World')
// })

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];



const isLogin = true

const projects = [ 
  // {
//   title: 'adasdawdsdawsda',
//   conten: '',
//   checkbox: [
//     'fa-brands fa-html5 fa-2x pe-2',
//     'fa-brands fa-css3 fa-2x pe-2',
//     'fa-brands fa-js-square fa-2x pe-2',
//     'fa-brands fa-bootstrap fa-2x pe-2'
//   ],
//   duration: ''
// } 
]


app.set('view engine', 'hbs');  // view engine

app.use('/public', express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));


app.get('/home', (req, res) => {
  db.connect(function (err, client, done) {
    if (err) throw err;
    
    const query = 'SELECT * FROM tb_project';
    
    client.query(query, function ( err, result ) {
      if (err) throw err

      const projects = result.rows;

    const newProject = projects.map((project) => {
        project.isLogin = isLogin

        return project;
      })
      console.log(newProject);

      res.render('home', {isLogin: isLogin, projects: newProject});
    })
    done()
  })
})



app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/addProject', (req,res) => {

    res.render('addProject')
})

app.post('/addProject', (req, res) => {
  const data = req.body;
  
  projects.push({
    title: data['name'],
    date: getFullTime(data['date1'], data['date2']),
    conten: data['conten'],
    checkbox:data['checkbox[]'],
    duration: difference(data['dateStart'], data['dateEnd']),
  })

  res.redirect('/home');
});

app.get('/home/delete/:id',(req,res)=>{
  projects.splice(req.params.id,1);
  res.redirect('/home');
})

app.get('/addProject/edit/:index',(req,res)=>{
  res.render('edit',{edit: projects[req.params.index],index:req.params.index});
})

app.post('/addProject/edit/:index', (req,res) =>{
  const data = req.body
  projects[req.params.index]={
    title: data['name'],
    date: getFullTime(data['date1'], data['date2']),
    conten: data['conten'],
    checkbox:data['checkbox[]'],
    duration: difference(data['dateStart'], data['dateEnd']),
  }

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



  function difference(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);

    const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

      day = 1000*60*60*24;
      dif =(date2utc - date1utc)/day;

    return dif < 30 ? dif +" hari" : parseInt(dif/30)+" bulan"
  }
  
  function getFullTime(dateStart,dateEnd){

    dateStart= new Date(dateStart);
    dateEnd = new Date(dateEnd);
    
    return `${dateStart.getDate()} ${month[dateStart.getMonth()]} ${dateStart.getFullYear()} - ${dateEnd.getDate()} ${month[dateEnd.getMonth()]} ${dateEnd.getFullYear()}`;
  }

 
  