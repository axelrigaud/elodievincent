jQuery(document).ready(function() {

  // ===== Pre Loader ===== //
  $(window).on("load", function(){
    $('.loader-wrapper').fadeOut(300);
    $('.splash').fadeIn(300);
  });


  
  //Behance stuff
  var apiKey  = 'zdinRP5GJarvCOa3PWiQxYb94dPyc9Xx';
  var userID  = 'hellovincent';

  var behanceProjectsAPI = 'http://www.behance.net/v2/users/'+ userID +'/projects?callback=?&api_key='+ apiKey+'&per_page=25';

  var behanceProjectAPI = function(id){
    return 'http://www.behance.net/v2/projects/'+id+'?callback=?&api_key='+ apiKey;
  };

  function preparePortfolio(rawProjectsData){
    var projectsData = [];

    for (var i=0;i<rawProjectsData.projects.length;i++){
      projectsData[i] = {};
      projectsData[i].name = rawProjectsData.projects[i].name;
      projectsData[i].cover = rawProjectsData.projects[i].covers["404"];
      projectsData[i].fields = [];
      if (rawProjectsData.projects[i].owners.fields){
        for (var j=0;j<rawProjectsData.projects[i].owners.fields.length;j++){
          
          switch (rawProjectsData.projects[i].owners.fields[j]){
            case 'Editorial Design':
              projectsData[i].fields[j] = 'print';
              break;
            case 'Web Design':
              projectsData[i].fields[j] = 'web';
              break;
            case 'Illustration':
              projectsData[i].fields[j] = 'illustration';
              break;
            case 'Typography':
              projectsData[i].fields[j] = 'typographie';
              break;
            case 'Animation':
              projectsData[i].fields[j] = 'video';
              break;
            case 'Fashion':
              projectsData[i].fields[j] = 'mode';
              break;
          }
        }
      }
    }
    console.log(projectsData);
    return projectsData;

  }

  function setPortfolioTemplate() {
      var rawProjectsData = JSON.parse(sessionStorage.getItem('behanceProjects')),
          rawTemplate = $('#portfolio-template').html(),
          template    = Handlebars.compile(rawTemplate);
      projectsData = preparePortfolio(rawProjectsData);
      var result = template(projectsData);
      $('#projects-grid').html(result);
      createLinks();
  };

  function prepareProject(rawProjectData){
    var projectData = {};
    projectData.modules = [];
    projectData.name = rawProjectData.project.name;
    projectData.description = rawProjectData.project.description;
    for(i=0;i<rawProjectData.project.modules.length;i++){
      projectData.modules[i] = {}; // init module so we don't get undefined
      if (rawProjectData.project.modules[i].type === "image"){
        projectData.modules[i].isImage = true;
        projectData.modules[i].src = rawProjectData.project.modules[i].src;

      }
      else{
        projectData.modules[i].isEmbed = true;
        projectData.modules[i].embed = rawProjectData.project.modules[i].embed
        
      }
    }
    console.log(projectData.modules);
    return projectData;
  }

  function setModalTemplate(id){
    var rawProjectData = JSON.parse(sessionStorage.getItem('behanceProject'+id)),
      rawTemplate = $('#modal-template').html(),
      template = Handlebars.compile(rawTemplate),
      projectData = prepareProject(rawProjectData),
      result = template(projectData);
    //append view
    $('#modal-container').html(result);
    $('#modal-container').css({
      "opacity":1,
      "pointer-events": "auto"
    });
    //set carrousel
    $(".owl-carousel").owlCarousel({
      singleItem:true
    });
    $("#close").on('click',function(){
      $('#modal-container').css({
      "opacity":0,
      "pointer-events":"none"
    });
    })

    

  };

  function showProject(id){
    if(sessionStorage.getItem('behanceProject'+id)){
      setModalTemplate(id);
    }
    else{
      $.getJSON(behanceProjectAPI(id),function(project){
        var data = JSON.stringify(project);
        sessionStorage.setItem('behanceProject'+id,data);
        setModalTemplate(id);
      })
    }
  }
  var setPortfolio = function(){
  if(sessionStorage.getItem('behanceProjects')) {
      setPortfolioTemplate();
  } else {
      $.getJSON(behanceProjectsAPI, function(projects) {
          var data = JSON.stringify(projects);
          sessionStorage.setItem('behanceProjects', data);
          setPortfolioTemplate();
      });
  }}
  function createLinks(){
    $('a').on('click',function(e){
      e.preventDefault();
      //scroll to Modal
      // $('html, body').animate({
      //   scrollTop: $("#project-Modal").offset().top
      //   }, 500);
      showProject($(this).data("project_id"));
    });
  }
  setPortfolio();

  //fullpage.js
  // $('#fullpage').fullpage({fitToSection : false,
  //                         verticalCentered : true,
  //                         afterRender : setPortfolio});

  //interface



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