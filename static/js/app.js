$(document).foundation();

rivets.formatters.capitalize = function(value){
  return value.charAt(0).toUpperCase() + value.slice(1).replace('_',' ');
}

function read_file(selector) {
  return new Promise(function(resolve, reject) {

    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      return reject('The File APIs are not fully supported in this browser.');
    }

    var input = $(selector)[0];
    if (!input) {
      return reject("Um, couldn't find the fileinput element.");
    }
    if (!input.files) {
      return reject("This browser doesn't seem to support the `files` property of file inputs.");
    }
    if (!input.files[0]) {
      return reject("Please select a file before clicking 'Set'");
    }
    var file = input.files[0];
    var fr = new FileReader();
    fr.onload = function() {
      resolve(fr.result);
    }
    fr.readAsDataURL(file);
  });
}/*----------------------- read file --------------------------*/

function receivedText() {
  document.getElementById('editor').appendChild(document.createTextNode(fr.result));
}

function init_table(id) {
  var table = $(id).dataTable({
      data: [],
      paging: false,
      ordering: false,
      searching: true,
      processing: true,
      info: false
  });

  // Apply the a search on each column input change
  table.api().columns().every(function () {
      var column = this;
      $('input', this.header()).on('keyup change', function () {
          if (column.search() !== this.value)
              column.search(this.value) .draw();
      });
  });

  table.add_rows = function(rows) {
    table.api().rows.add(rows);
    table.api().draw();
  }

  return table;
}/*------------------- init_table ------------------*/

function notify(msg, type) {
  $('.top-right').notify({
  	message: {text: msg},
    type: type
  }).show();
}/*------------------- notify ----------------------*/

var state = {
  first: {
    name: "left-table",
    fields:["Id", "Name", "Address"]
  },
  second: {
    name:"right-table",
    fields: ["Id", "Name", "Address", "Message"]
  },
  monitor: {
    interval: 15,
    file_path: ''
  }
};/*------------------------- state ------------------------*/

state.monitor.set_interval = function() {
  var interval = state.monitor.interval;
  if(!interval) return notify('Invalid interval value', 'error');
  /* send req */
  notify('New interval of ' + interval + ' is now set');
}

state.monitor.monitor_all = function(){
  notify('Monitor all request successful');
}
state.monitor.monitor_pause = function() {
  notify('Monitor puase request successful');
}
state.monitor.monitor_file = function() {
  read_file('.input-file')
    .then(function(d) {
      notify('Requesting mointor file ...');
      return axios
        .post('/monitor/file', {
          name: 'find-later',
          content: d
        });
    })
    .then(notify)
    .catch(function(err) {
      console.warn(err.data);
      notify(err, 'error');
    });
}/*---------------------- monitor file --------------------------*/

state.get_tables = function() {
  return axios.get('/tables')
    .then(function (res) {
      var tables = res.data;
      notify('Found ' + tables.map(function(t) { return t.name; }).join(', ') + ' tables');
      tables.length !== 3 && notify('Error: server must return 3 tables', 'error');
      state.first = tables[0];
      state.second = tables[2];
    })
    .catch(function (error) {
      notify(error.toString(), 'error');
    });
}/*-------------------------- get_tables -------------------*/

state.get_tables();
rivets.bind($('body')[0], state); /* bind the dom elements */
// var first_table = init_table('#first-table');
// var second_table = init_table('#second-table');

// second_table.add_rows([['amin','roosta','test', 'yey']])
