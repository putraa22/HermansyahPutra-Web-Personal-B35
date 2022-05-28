const express = require ('express');
const db = require ('./db_project/database')
const hbs = require ('hbs')


const app = express()
const port = 3000




// app.get('/',  (req,  res) => {
//     res.send(' Magic World')
// })

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];



const isLogin = true

const projects = [ 
  {
  title: 'adasdawdsdawsda',
  dateStart: '',
  dateEnd: '',
  conten: '',
  checkbox: [
    'fa-brands fa-html5 fa-2x pe-2',
    'fa-brands fa-css3 fa-2x pe-2',
    'fa-brands fa-js-square fa-2x pe-2',
    'fa-brands fa-bootstrap fa-2x pe-2'
  ],
  duration: '',
}]


app.set('view engine', 'hbs');  // view engine
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));


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

app.get('/addProject/edit/:id',(req,res)=>{
  db.connect(function (err, client, done) {
    if (err) throw err;
    const id = req.params.id
    const query = `SELECT id, title, "dateStart", "dateEnd", conten, checkbox, image, duration
    FROM projects where id = ${id};`

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

app.post('/addProject/edit/:id', (req,res) =>{
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
    if (err) throw err
    const id = req.params.id
    const query = `UPDATE public.projects
    SET title='${data.title}', "dateStart"='${data.dateStart}', "dateEnd"='${data.dateEnd}', conten='${data.conten}', checkbox='{${data.checkbox.toString()}}',
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




app.listen(port, () => {
    console.log(`Server running on PORT: ${port}`);
  });



//   function getDateDifference(dateStart, dateEnd) {
//     if (dateStart > dateEnd) {
//         console.error('Start date must be before end date');
//         return null;
//     }
//     let startYear = dateStart.getFullYear();
//     let startMonth = dateStart.getMonth();
//     let startDay = dateStart.getDate();

//     let endYear = dateEnd.getFullYear();
//     let endMonth = dateEnd.getMonth();
//     let endDay = dateEnd.getDate();

//     let february = (endYear % 4 == 0 && endYear % 100 != 0) || endYear % 400 == 0 ? 29 : 28;
//     let daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//     let startDateNotPassedInEndYear = (endMonth < startMonth) || endMonth == startMonth && endDay < startDay;
//     let years = endYear - startYear - (startDateNotPassedInEndYear ? 1 : 0);

//     let months = (12 + endMonth - startMonth - (endDay < startDay ? 1 : 0)) % 12;

//     let days = startDay <= endDay ? endDay - startDay : daysOfMonth[(12 + endMonth - 1) % 12] - startDay + endDay;

//     return { 
//         years: years,
//         months: months,
//         days: days
//     }
    
// }

// function processDataProjects(data, isUpdate=false){
//   const dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
//   data.map((x)=>{
//       x.lengthDate = getDateDifference(new Date(x.dateStart), new Date(x.dateEnd));
//       x.dateStart = isUpdate ? x.dateStart : x.dateStart.toLocaleDateString('id-ID', dateFormatOptions);
//       x.dateEnd = isUpdate ? x.dateEnd : x.dateEnd.toLocaleDateString('id-ID', dateFormatOptions);
//       // if (x.technologies.includes("nodejs")){
//       //     x.technologies.nodejs = true;
//       // }
//       // if (x.technologies.includes("reactjs")){
//       //     x.technologies.reactjs = true;
//       // }
//       // if (x.technologies.includes("nextjs")){
//       //     x.technologies.nextjs = true;
//       // }
//       // if (x.technologies.includes("typescript")){
//       //     x.technologies.typescript = true;
//       // }
//   })
//   return data;
// }

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