var typing = false;
var keystrokes = 0;

$(function(){  
  
  $('h1').hover(function(){
    $(this).toggleClass('highlight');
  });
  
  $('h1').click(function(){
    $(this).after('<input type="text" class="text" id="title" name="title" value="'+$(this).text()+'"/>');
    $(this).hide();
  });
  
  $('#title').live('keypress', function(event){
    if(event.keyCode == 13){
      $.ajax({
        type: 'POST',
        url: document.location.pathname,
        data: {title: function(){
          return $('#title').val();
        }},
        success: function(response){
          $('h1').show().text( $('#title').val() );
          $('#title').remove();
          console.log(response)
        }
      })
      
    }
  })
  
  $('textarea').focus().autogrow().keyup(function(){
    keystrokes += 1;
    if(typing == false){
      typing = true;
      $('body').removeClass('slacking');
    }
    if(keystrokes > 99){
      saveNewVersion();
    }
  });
  
  $(document).mousemove(function(){
    if(typing == true){
      typing = false;
      saveNewVersion();
      $('body').addClass('slacking');
    }
  });
  
})

var saveNewVersion = function(){
  $.ajax({
    type: 'POST',
    url: document.location.pathname,
    data: {text: function(){
      return $('textarea').val();
    }},
    success: function(response){
      keystrokes = 0;
      console.log(response);
    }
  })
}
