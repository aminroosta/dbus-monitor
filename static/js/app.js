$(document).foundation();

rivets.formatters.capitalize = function(value){
  return value.charAt(0).toUpperCase() + value.slice(1).replace('_',' ');
}
/* notify another function on property changes */
rivets.formatters['notify'] = function() {
    var args = [].slice.call(arguments, 0);
    var value = args[0];
    if(value) {
      setTimeout(function() {
        for (var i = 1; i < args.length ; ++i) {
          args[i](value);
        }
      });
    }
    return value;
}

function notify(msg, type) {
  $('.top-right').notify({
  	message: {text: msg},
    type: type
  }).show();
}/*------------------- notify ----------------------*/
function warn(msg) {
  notify(msg, 'error');
}/*------------------- warn ------------------------*/

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

function init_table(id) {
  var table = $(id).dataTable({
      data: [],
      paging: false,
      ordering: false,
      searching: true,
      processing: true,
      scrollY: "400px",
      scrollCollapse: true,
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
    var api = table.api();
    var scrollbody = table.parent();

    var count = api.rows().count();
    var tr = api.row(count-1).node();
    var old_scroll_top = scrollbody.scrollTop();

    var auto_scroll = scrollbody[0].scrollHeight - scrollbody.scrollTop() == scrollbody.outerHeight();

    api.rows.add(rows);
    api.draw();

    var count = api.rows().count();
    var tr = api.row(count-1).node();

    var new_scroll_top = $(tr).offset().top - scrollbody.height();

    scrollbody.scrollTop(old_scroll_top);
    if(auto_scroll)
      scrollbody.animate({scrollTop: new_scroll_top }, 500);
  }

  table.replace_rows = function(rows) {
    table.api().rows().remove();
    table.add_rows(rows);
  }


  return table;
}/*------------------- init_table ------------------*/

function init_table_list(id) {
  var table = init_table(id);
  setInterval(function() {
    axios.get('/query/process_list')
         .then(function(data){
           var rows = data.data.map(function(r) {
             return [r.id, r.name, r.address];
           });
           table.replace_rows(rows);
         })
         .catch(warn);
  }, 3000);
};

function update_select(first_time) {
  return axios.get('/query/run')
       .then(function(data) {
         var rows = data.data;
         state.run.rows = rows;
       })
       .catch(warn);
}

var state = {
  list: {
    name: "left-table",
    fields:["Id", "Name", "Address"]
  },
  run: {
    name:"right-table",
    run_id: 0,
    last_id: 0,
    rows: [{filename: 'Please select', start: '', id: '0'}]
  },
  log: {
    name:"right-table",
    fields: ["Id", "Name", "Address", "Message", "Type", "Run id"]
  },
  monitor: {
    interval: 15,
    file_path: ''
  }
};/*------------------------- state ------------------------*/

var logtbl = null;
var loginterval = null;
function update_log_table(clear) {
    var run_id = state.run.run_id;
    var last_id = state.run.last_id;
    console.warn(clear);
    axios.get('/query/log/' + run_id + '/' + last_id)
         .then(function(data) {
           var rows = data.data.map(function(r) {
             if(r.id > last_id) last_id = r.id;
             return [r.id, r.name, r.address, r.message, r.type, r.run_id];
           });
           state.run.last_id = last_id;
           if(clear) logtbl.replace_rows(rows);
           else logtbl.add_rows(rows);
         })
         .catch(warn);
}/*------------------------------ update log table ------------------*/

state.run_id_changed = function() {
  state.run.last_id = 0;
  if(!logtbl) { return warn('table is not yet initialized!'); return; }
  update_log_table(true);

  loginterval && clearInterval(loginterval);
  loginterval = setInterval(update_log_table, (state.monitor.interval * 1000) || 15000);
}/*----------------------------- run id changed ----------------------*/

state.moinotr_interval_changed = function() {
  var inter = state.monitor.inter;
  console.warn(inter);
  if(loginterval && inter) {
      notify('Log table interval updated to ' + inter + ' seconds')
      loginterval && clearInterval(loginterval);
      loginterval = setInterval(update_log_table, (inter * 1000) || 15000);
  }
}

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
      state.list = tables[0];
      state.run = tables[1];
      state.log = tables[2];
      init_table_list('#list-table');
      update_select(true /* first_time */);
      logtbl = init_table('#log-table');
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
