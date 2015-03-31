jQuery(document).ready(function() {

  // ===== Pre Loader ===== //
  $(window).on("load", function(){
    $('.loader-wrapper').fadeOut(300);
    $('.splash').fadeIn(300);
  });
  
  //Behance stuff
  var apiKey  = 'zdinRP5GJarvCOa3PWiQxYb94dPyc9Xx';
  var userID  = 'hellovincent';

  var behanceProjectsAPI = 'http://www.behance.net/v2/users/'+ userID +'/projects?callback=?&api_key='+ apiKey;

  var behanceProjectAPI = function(id){
    return 'http://www.behance.net/v2/projects/'+id+'?callback=?&api_key='+ apiKey;
  };

  function setPortfolioTemplate() {
      var projectsData = JSON.parse(sessionStorage.getItem('behanceProjects')),
          rawTemplate = $('#portfolio-template').html(),
          template    = Handlebars.compile(rawTemplate),
          result      = template(projectsData);
      $('#projects-grid').html(result);
  };

  function setViewerTemplate(id){
    var projectData = JSON.parse(sessionStorage.getItem('behanceProject'+id)),
      rawTemplate = $('#viewer-template').html(),
      template = Handlebars.compile(rawTemplate),
      result = template(projectData.project);
    //append view
    $('#project-viewer').html(result);
    //set carrousel
    $(".owl-carousel").owlCarousel({
      singleItem:true
    });

    

  };

  function showProject(id){
    if(sessionStorage.getItem('behanceProject'+id)){
      setViewerTemplate(id);
    }
    else{
      $.getJSON(behanceProjectAPI(id),function(project){
        var data = JSON.stringify(project);
        sessionStorage.setItem('behanceProject'+id,data);
        setViewerTemplate(id);
      })
    }
  }

  if(sessionStorage.getItem('behanceProjects')) {
      setPortfolioTemplate();
  } else {
      $.getJSON(behanceProjectsAPI, function(projects) {
          var data = JSON.stringify(projects);
          sessionStorage.setItem('behanceProjects', data);
          setPortfolioTemplate();
      });
  };

  //interface

  $('a').on('click',function(e){
    e.preventDefault();
    //scroll to viewer
    $('html, body').animate({
      scrollTop: $("#project-viewer").offset().top
      }, 500);
    showProject($(this).data("project_id"));
  });

  var $container = $('.portfolio-container');

  $container.isotope({
    itemSelector: '.portfolio-item',
    layoutMode: 'fitRows',
  });

  $('.illustration-filter').click(function(){
    $container.isotope({filter: '.illustration'});
  });

  $('.portfolio-item').click(function(){
    $container.fadeOut('slow',function(){
      target='portfolio';
      scrollTo(target,function(){
        $.get('./portfolio/showpackage.html',function(data){
          $('section.portfolio').html(data);
          });
        });
    });
  })

  function scrollTo(target,callback){
    $('html, body').animate( { scrollTop: $('.'+target).offset().top }, 750 );
    return callback;
  }
});