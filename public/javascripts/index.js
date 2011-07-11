$(function(){
  $('.text').val("Your title here").css('color', '#CCC').focus(function(){
    if($(this).val() == "Your title here"){
      $(this).val('').css('color', 'inherit');
    }
  }).blur(function(){
    if($(this).val() == ""){
      $(this).val("Your title here").css('color', '#CCC');
    }
  });
})