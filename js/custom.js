$('.video-toggle, .video-dim').click(function(){
  $("iframe").toggleClass('open');
  $(".dim").toggleClass('open');
  $(".video-container").toggleClass('open');
  $(".container").toggleClass('shrink');
});

/*
$('#personalize-toggle').click(function(){
  $("#home").toggleClass('shrink');
  $("#personalize").toggleClass('open');
});
*/
