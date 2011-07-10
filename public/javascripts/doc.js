$(function(){  
  $('textarea').focus().autogrow();
  $('textarea').keyup(function(){
    saveNewVersion();
  })
})

var saveNewVersion = function(){
  console.log($('textarea').val());
  $.ajax({
    type: 'POST',
    url: document.location.pathname,
    data: {text: function(){
      return $('textarea').val();
    }},
    success: function(response){
      console.log(response);
    }
  })
}