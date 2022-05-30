const express = require ('express');
const db = require ('./db_project/database')
const hbs = require ('hbs');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const app = express()
const port = 3000


const isLogin = true;



// app.get('/',  (req,  res) => {
//     res.send(' Magic World')
// })

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];







app.set('view engine', 'hbs');  // view engine
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  })
);

app.use(flash());


app.get('/home', (req, res) => {
  db.connect(function (err, client, done) {
    if (err) throw err;
    
    const query = 'SELECT * FROM projects';
    
    client.query(query, function ( err, result ) {
      if (err) throw err

      const projects = result.rows;
      


    const newProject = projects.map((project) => {
        project.isLogin = isLogin
        project.duration = difference(project.duration)
      

        return project;
      })
      // console.log(newProject);
      res.render('home', {isLogin: isLogin, projects: newProject,  });
    })
    done()
  })
})



app.get('/about', (req, res) => {
  res.render('about');
});

// Add Project

app.get('/addProject', (req,res) => {
    res.render('addProject')
})
app.post('/addProject',  (req, res) => {
  const data = {
    title : req.body.title,
    dateStart : req.body.dateStart,
    dateEnd : req.body.dateEnd,
    conten : req.body.conten,
    checkbox: [],
    duration: req.body.duration,
  }
  if  (req.body.html) {
    data.checkbox.push('fa-brands fa-html5 fa-2x pe-2')
  }
  if (req.body.css) {
    data.checkbox.push('fa-brands fa-css3 fa-2x pe-2')
  }
  if (req.body.js) {
    data.checkbox.push('fa-brands fa-js-square fa-2x pe-2')
  }
  if (req.body.bs) {
    data.checkbox.push('fa-brands fa-bootstrap fa-2x pe-2')
  }

  db.connect(function (err, client, done) {
    if (err) throw err;
    
    const query = `INSERT INTO projects (title,"dateStart", "dateEnd", conten, checkbox) VALUES('${data.title}','${data.dateStart}', '${data.dateEnd}', '${data.conten}', '{${data.checkbox.toString()}}');`;

    client.query(query, function (err, result) {
      if (err) throw err;
      res.redirect('/home');
    });
    done();
  });   
});

// Add Project

app.get('/home/delete/:id',(req,res)=>{
  db.connect(function (err, client, done) {
    if (err) throw err;
    const id = req.params.id
    const query = `DELETE FROM projects WHERE id = ${id};`

    client.query(query, function (err, result) {
      if(err) throw err
      res.redirect('/home');
    })
  // projects.splice(req.params.id,1);
    done()
  })
})

// Project Edit / Update

app.get('/edit/:id',(req,res)=>{
  db.connect(function (err, client, done) {
    if (err) throw err;
    const id = req.params.id;
    const query = `SELECT id, title, "dateStart", "dateEnd", conten, checkbox, image
    FROM projects WHERE id = ${id};`

    client.query(query, function(err, result){
      if(err) throw err

      const projects = result.rows;
      const data = projects.map((project) => {
          project.duration = difference(project.duration)
          return project;
        })
        res.render('edit',{edit: data[0]});
      })
      done()
  })
})

app.post('/edit/:id', (req,res) =>{
  const data = {
    title : req.body.title,
    dateStart : req.body.dateStart,
    dateEnd : req.body.dateEnd,
    conten : req.body.conten,
    checkbox: [],
    duration: req.body.duration,
  }
  if  (req.body.html) {
    data.checkbox.push('fa-brands fa-html5 fa-2x pe-2')
  } else {
    data.checkbox.push('')
  }
  if (req.body.css) {
    data.checkbox.push('fa-brands fa-css3 fa-2x pe-2')
  } else {
    data.checkbox.push('')
  }
  if (req.body.js) {
    data.checkbox.push('fa-brands fa-js-square fa-2x pe-2')
  } else {
    data.checkbox.push('')
  }
  if (req.body.bs) {
    data.checkbox.push('fa-brands fa-bootstrap fa-2x pe-2')
  } else {
    data.checkbox.push('')
  }
  db.connect(function (err, client, done) {
    if (err) throw err
    const id = req.params.id
    const query = `UPDATE projects
    SET title='${data.title}', "dateStart"='${data.dateStart}', "dateEnd"='${data.dateEnd}', conten='${data.conten}', checkbox= ARRAY ['${data.checkbox[0]}', '${data.checkbox[1]}', '${data.checkbox[2]}', '${data.checkbox[3]}']
    WHERE id = ${id};`
   
    client.query(query, function(err, result) {
      if(err) throw err


      res.redirect('/home');
    })
    done()
  })
})

// Project Edit / Update


app.get('/detail/:id', (req, res) => {
  const id = req.params.id;

  db.connect(function (err, client, done) {
    if (err) throw err;
    
    const query = `SELECT * FROM projects where id = ${id}`;
    
    client.query(query, function ( err, result ) {
      if (err) throw err

      const projects = result.rows;
      


      const data = projects.map((project) => {
          project.duration = difference(project.duration)
        
  
          return project;
        })
      // const project = result.rows
      // let data = processDataProjects(project)
      res.render('detail', { project: data[0] });
    })
    done()
  })
});


app.get('/contact', (req, res) => {
  res.render('contact');
});



// Form Login & Register 
app.get('/login', (req, res) => {
  res.render('login');
})

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == '' || password == '') {
    req.flash('warning!!', 'Masukkan data!!');
    return res.redirect('/login');
  }
  
  db.connect(function (err, client, done) {
    if (err) throw err;
    const query = `SELECT * FROM users WHERE email = '${email}';`;

    

    client.query(query, function (err, result) {
      if (err) throw err;

      const data = result.rows; 

      if (data.length == 0) {
        req.flash('error', 'Email not found');
        return res.redirect('/login');
      }

      const isMatch = bcrypt.compareSync(password, data[0].password);

      if (isMatch == false) {
        req.flash('error', 'Password not match');
        return res.redirect('/login');
      }

      req.session.isLogin = true
      req.session.user = {
        id: data[0].id,
        email: data[0].email,
        name: data[0].name,
      };

      req.flash('success', `Welcome, <b>${data[0].name}</b>`);

      res.redirect('/home');
    })
    done()
  })
})



app.get('/register', (req, res) => {
  res.render('register');
})

app.post('/register', (req, res) => {
 const name = req.body.name;
 const email = req.body.email;
 let password = req.body.password;

 password = bcrypt.hashSync(password, 10 )
 
  db.connect(function (err, client, done) {
    if (err) throw err;

    const query = `INSERT INTO users (name, email, password) VALUES('${name}','${email}','${password}');`;

    client.query(query, function (err, result) {

      if (err) throw err;
      res.redirect('/login');
    })
    done()
  })
})


app.get('/exit', (req, res) => {
  req.session.destroy();
  res.redirect('/home');
});








// Form Login & Register 




app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
  });


hbs.registerHelper("fulltime", function () {
  return getFullTime(this.project.dateStart, this.project.dateEnd);
});


hbs.registerHelper("duration", function (project = false) {
  if (project == true) {
    this.dateStart = this.project.dateStart;
    this.dateEnd = this.project.dateEnd;
  }
  return difference(this.dateStart, this.dateEnd);
});
  
  function difference(dateStart, dateEnd) {
    dateStart = new Date(dateStart);
    dateEnd = new Date(dateEnd);

    const date1utc = Date.UTC(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate());
    const date2utc = Date.UTC(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate());

      day = 1000*60*60*24;
      dif =(date2utc - date1utc)/day;

    return dif < 30 ? dif +" hari" : parseInt(dif/30)+" bulan"
  }
  
  function getFullTime(dateStart, dateEnd){

    dateStart= new Date(dateStart);
    dateEnd = new Date(dateEnd);
    
    return `${dateStart.getDate()} ${month[dateStart.getMonth()]} ${dateStart.getFullYear()} - ${dateEnd.getDate()} ${month[dateEnd.getMonth()]} ${dateEnd.getFullYear()}`;
  }