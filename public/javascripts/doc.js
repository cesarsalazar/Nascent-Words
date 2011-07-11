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
  }).keypress(function(){
    var num = keystrokes;
    $('#content').append('<audio id="audio'+num+'" src="/audio/keystroke.mp3" preload="auto"/>');
     document.getElementById('audio'+num).addEventListener('ended', function(){
       $('#audio'+num).remove();
     })
    document.getElementById('audio'+num).play();
    
    
  })
  
  $(document).mousemove(function(){
    if(typing == true){
      typing = false;
      saveNewVersion();
      var wordcount = $('textarea').val().match(/\b/g).length/2;
      var charcount = $('textarea').val().split('').length;
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
    }
  })
}

var wordCount = function(s){
  s = trim(s);
  return s.split(" ").length
}

var trim = function(s) {
 s = s.replace(/(^\s*)|(\s*$)/gi,"");
 s = s.replace(/[ ]{2,}/gi," ");
 //s = s.replace(/\n /,"\n ");
 return s;
}