let projects = [];


function addCard() {
    let project = document.getElementById('project').value;

    let durasi = (document.getElementById('date1').value);
    let durasi2 = ( document.getElementById('date2').value);

    let conten = document.getElementById('conten').value;
    let image = document.getElementById('formFile').files[0];
    image = URL.createObjectURL(image);

    let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    let checkbox = [];
      checkboxes.forEach(el => {
        checkbox.push(el.value);
      });

// Start Checkbox Tes

    // let icon = [];
    // if (document.getElementById('satu').checked){
    //   icon.push('satu');
    // }
    // if (document.getElementById('dua').checked){
    //   icon.push('dua');
    // }
    // if (document.getElementById('tiga').checked){
    //   icon.push('tiga');
    // }
    // if (document.getElementById('empat').checked){
    //   icon.push('empat');
    // }
          
    // function iconElement (list) {
//   let iconCheck = '';
  
//   if (list.includes('satu')){
//     iconCheck += '<i class="fa-brands fa-html5 fa-2x pe-2"></i>';
//   }
//   if (list.includes('dua')){
//     iconCheck += '<i class="fa-brands fa-css3 fa-2x pe-2"></i>';
//   }
//   if (list.includes('tiga')){
//     iconCheck += '<i class="fa-brands fa-js-square fa-2x pe-2"></i>';
//   }
//   if (list.includes('empat')){
//     iconCheck += '<i class="fa-brands fa-bootstrap fa-2x pe-2"></i>';
//   }

//   return iconCheck;

// }

// End Checbox Tes


    let card = { 
        project: project,
        durasi: durasi,
        durasi2: durasi2,
        conten: conten,
        checkbox: checkbox,
        
        image: image,
    };

    projects.push(card);

    renderProjects();
}

function renderProjects() {
    let projectContainer = document.getElementById('thumb');

    projectContainer.innerHTML = '';

    projects.forEach((data) => {
        projectContainer.innerHTML +=
        `<div class="col-4 mb-4 "  >
        <div class="card" id="projectCard" style="width: 18rem;" >
          <img src="${data.image}" class="card-img-top p-2" alt="...">
          <div class="card-body"><a href="./detail-project/detail-project.html" style="text-decoration: none; color: #000;">
            <h5 class="card-title">${data.project}</h5>
            <p id="durasi" class="card-subtitle text-muted " style="font-size: 12px;">Waktu Pengerjaan : ${data.durasi} - ${data.durasi2}</p>
            <p class="card-text">${data.conten}</p>
            <div class="pt-2 pb-2 me-auto" id="material">
              ${data.checkbox.toString().replaceAll(',','')}
            </div>
            <div class="d-flex justify-content-between">
            <a href="#" class="btn btn-secondary btn-sm flex-grow-1 me-3 " style="border-radius: 16px; font-size: 12px;">Edit</a>
            <a href="#" class="btn btn-secondary btn-sm flex-grow-1" style="border-radius: 16px; font-size: 12px;">Delete</a>
            </div>
            
            </a>
          </div>
        </div>
      </div>`

    });

    
}


