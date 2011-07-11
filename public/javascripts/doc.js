var typing = false;
var sound = false;
var keystrokes = 0;

$(function(){  
  
  $('h1').mouseover(function(){
    $(this).addClass('highlight');
  }).mouseout(function(){
    $(this).removeClass('highlight');
  })
  
  $('h1').click(function(){
    $(this).after('<input type="text" class="text" id="title" name="title" value="'+$(this).text()+'"/>');
    $(this).hide();
  });
  
  $('body').click(function(e){
    if(e.target != $('#title')[0] && e.target != $('h1')[0]){
      updateTitle();
    }
  })
  $('#title').live('keypress', function(event){
    if(event.keyCode == 13){
      updateTitle();
    }
  })
  
  $('textarea').autogrow().keyup(function(){
    keystrokes += 1;
    if(!typing){
      typing = true;
      $('body').removeClass('slacking');
    }
    if(keystrokes > 99){
      saveNewVersion();
    }
  }).keypress(function(){
    if(sound){
      var num = keystrokes;
      $('#content').append('<audio id="audio'+num+'" src="/audio/keystroke.mp3" preload="auto"/>');
       document.getElementById('audio'+num).addEventListener('ended', function(){
         $('#audio'+num).remove();
       });
      document.getElementById('audio'+num).play();
    };
  }).focus();
  
  $(document).mousemove(function(){
    if(typing){
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

var updateTitle = function(){
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