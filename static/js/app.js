$(document).foundation();

function init_table(id){
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
}


var first_table = init_table('#first-table');
var second_table = init_table('#second-table');

second_table.add_rows([['amin','roosta','test', 'yey']])

$('.top-right').notify({
	message: {text: 'Aw yeah, It works!'},
  // type: 'error'
}).show();
