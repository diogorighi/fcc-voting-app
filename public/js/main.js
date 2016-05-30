$(function(){

  $('.btn-delete').on('click', function(e){
    e.preventDefault();
    var $item = $(this).closest('.list-group-item');
    var path = $(this).attr('href');
    var request = $.ajax({
      method: "DELETE",
      url: path
    });

    request.done(function(json) {
      if(json.success){
        alert(json.message);
        $item.fadeOut(300);
      }
    });

    request.fail(function( jqXHR, textStatus ) {
      alert( "Request failed: " + textStatus );
    });
  });

  $(".btn-add-option").on('click', function(e){
    e.preventDefault();

    var html = "";
    html += '<fieldset class="form-group">';
  	html += '<input class="form-control" type="text" name="options[]" placeholder="...">';
  	html += '</fieldset>';

    $(html).insertBefore($(this).closest('.form-group'));
  });

});
