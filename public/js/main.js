$(function(){

  //Button deletes poll
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

  //Btn add options when creating new poll
  $(".btn-add-option").on('click', function(e){
    e.preventDefault();

    var html = "";
    html += '<fieldset class="form-group">';
  	html += '<input class="form-control" type="text" name="options[]" placeholder="...">';
  	html += '</fieldset>';

    $(html).insertBefore($(this).closest('.form-group'));
  });

  //Btn create option when voting
  $('.btn-create-option').on('click', function(e){
    e.preventDefault();

    var html = "";
    html += '<fieldset class="form-group fieldset-vote-add">';
  	html += '<input class="form-control" type="text" name="option" placeholder="Your new option">';
    html += '<a class="btn btn-secondary btn-create-option-add m-t-1 pull-xs-right" href="#">Add</a>';
  	html += '</fieldset>';

    $(this).closest('.form-group').after(html);
  });

  //Add the option created to list
  $('body').on('click', '.btn-create-option-add', function(e, other, other2){
    e.preventDefault();

    var addButon = $(this)[0];

    var inputValue = $(addButon).siblings('.form-control').val();
    console.log(inputValue);

    var html = "";
    html += '<li class="list-group-item">';
    html += '<label class="c-input c-radio">';
    html += '<input name="option" type="radio" value="' + inputValue + '">';
    html += '<span class="c-indicator"></span>';
    html += inputValue;
    html += '</label>';
    html += '</li>';

    $('.list-group').append(html);
    $('.fieldset-vote-add').fadeOut(300, function(){
      $(this).remove();
    });

  });


});
