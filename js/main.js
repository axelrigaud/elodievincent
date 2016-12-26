jQuery(document).ready(function() {

  $(window).on("load", function(){
    $('.loader-wrapper').fadeOut(300);
    $('.hero').fadeIn(300);
    $('.wp1').waypoint(function() {
      $('.wp1').addClass('animated fadeInUp');
      }, {
      offset: '80%'
    });
  });

  var Carousel = (function () {

    var _navContainer;

    var _setOwlStageHeight = function (event) {
      var maxHeight = 0;
      $('.owl-item.active').each(function () { // LOOP THROUGH ACTIVE ITEMS
          var thisHeight = parseInt( $(this).height() );
          maxHeight=(maxHeight>=thisHeight?maxHeight:thisHeight);
      });
      $('.owl-carousel').css('height', maxHeight );
      $('.owl-stage-outer').css('height', maxHeight ); // CORRECT DRAG-AREA SO BUTTONS ARE CLICKABLE
      $('.owl-stage').css('height', maxHeight );

      // forces iframe width to prevent overlapping with other non iframe elements
      if ($('iframe').length > 0) {
        var newWidth = $('.owl-item').width();
        $('iframe').width(newWidth);
      }
    };

    var _showNav = function () {
      $owlSlides = $(".owl-carousel").children('img');
      if ($owlSlides.length > 1) {
        _navContainer = '.owl-nav';
      }
      else {
        _navContainer = false;
      }
    };

    return {
      init: function () {

        _showNav();

        //set carrousel
        $('#modal-container').imagesLoaded(function(){
          $('.loader-wrapper').fadeOut(300);
          $('.owl-carousel').owlCarousel({
            navContainer: _navContainer,
            margin: 10,
            nav: true,
            center: true,
            autoHeight: true,
            onInitialized: _setOwlStageHeight,
            onResized: _setOwlStageHeight,
            onTranslated: _setOwlStageHeight,
            responsive: {
              0 : {
                items: 1
              },
              600: {
                items: 2
              },
              900: {
                items: 3
              }
            }
          });
        });
      }
    }

  })();

  var Project = (function () {
    //duplicate with portfolio module !!
    var _settings = {
      apiKey  : 'zdinRP5GJarvCOa3PWiQxYb94dPyc9Xx'
    };

    var _behanceProjectAPI = function (id) {
      return 'http://www.behance.net/v2/projects/'+id+'?callback=?&api_key='+ _settings.apiKey;
    };

    var _prepareProject = function (rawProjectData) {
      var projectData = {};
      projectData.modules = [];
      projectData.name = rawProjectData.project.name;
      projectData.description = rawProjectData.project.description;
      for(i=0;i<rawProjectData.project.modules.length;i++){
        projectData.modules[i] = {}; // init module so we don't get undefined
        if (rawProjectData.project.modules[i].type === "image"){
          projectData.modules[i].isImage = true;
          projectData.modules[i].src = rawProjectData.project.modules[i].sizes.original;

        }
        else {
          projectData.modules[i].isEmbed = true;
          projectData.modules[i].embed = rawProjectData.project.modules[i].embed

        }
      }
      return projectData;
    };

    var _setModalTemplate = function (id) {
          $('.loader-wrapper').fadeIn(300);
          var rawProjectData = JSON.parse(sessionStorage.getItem('behanceProject'+id)),
            rawTemplate = $('#modal-template').html(),
            template = Handlebars.compile(rawTemplate),
            projectData = _prepareProject(rawProjectData),
            result = template(projectData);
          //append view
          $('#modal-container').html(result);
          $('#modal-container').css({
            "opacity":1,
            "pointer-events": "auto"
          });

          $("#close").on('click',function(){
            $('#modal-container').css({
            "opacity":0,
            "pointer-events":"none"
            });
          });

          Carousel.init();
        };

    var showProject = function (id) {
      if (sessionStorage.getItem('behanceProject'+id)){
        _setModalTemplate(id);
      }
      else {
        var that = this;
        $.getJSON(_behanceProjectAPI(id),function(project){
          var data = JSON.stringify(project);
          sessionStorage.setItem('behanceProject'+id,data);
          _setModalTemplate(id);
        })
      }
    }

    return {
      showProject: showProject
    }
  })();

  var Portfolio = (function () {

    var _settings = {
      apiKey  : 'zdinRP5GJarvCOa3PWiQxYb94dPyc9Xx',
      userID  : 'hellovincent'
    };

    var _behanceProjectsAPI = function () {
      return 'http://www.behance.net/v2/users/'+ _settings.userID +'/projects?callback=?&api_key='+ _settings.apiKey+'&per_page=25';
    };

    var _preparePortfolio = function (rawProjectsData) {
      var projectsData = [];
      for (var i=0; i<rawProjectsData.projects.length; i++){
        projectsData[i] = {};
        projectsData[i].name = rawProjectsData.projects[i].name;
        projectsData[i].id = rawProjectsData.projects[i].id;
        projectsData[i].cover = rawProjectsData.projects[i].covers["404"];
        projectsData[i].fields = [];

        if (rawProjectsData.projects[i].fields) {
          for (var j=0;j<rawProjectsData.projects[i].fields.length;j++){

            switch (rawProjectsData.projects[i].fields[j]){

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
      return projectsData;
    };

    var _createLinks = function () {
      var that = this;
      $('.portfolio-item a').on('click', function(e){
        e.preventDefault();
        Project.showProject($(this).data("project_id"));
      });
    };

    var _setPortfolioTemplate = function () {
        var rawProjectsData = JSON.parse(sessionStorage.getItem('behanceProjects')),
            rawTemplate = $('#portfolio-template').html(),
            template    = Handlebars.compile(rawTemplate);
        projectsData = _preparePortfolio(rawProjectsData);
        var result = template(projectsData);
        $('#projects-grid').html(result);
        _createLinks();
    };

    var _isotopeInit = function () {
      $(window).on("load", function () {
      setTimeout(function() {
        var $container = $('#projects-grid');
        $container.isotope({
          itemSelector: '.portfolio-item',
          layoutMode: 'fitRows',
        });
        $container.imagesLoaded( function() {
          $container.isotope('layout');
        });
        $('.all-filter').click(function(){
        $container.isotope({filter: '*'});
        });

        $('.print-filter').click(function(){
          $container.isotope({filter: '.print'});
        });

        $('.web-filter').click(function(){
          $container.isotope({filter: '.web'});
        });

        $('.illustration-filter').click(function(){
          $container.isotope({filter: '.illustration'});
        });

        $('.typographie-filter').click(function(){
          $container.isotope({filter: '.typographie'});
        });

        $('.video-filter').click(function(){
          $container.isotope({filter: '.video'});
        });

        $('.mode-filter').click(function(){
          $container.isotope({filter: '.mode'});
        });
      },3000);
      });

    };

    return {

      init: function () {

        // we first check if behance data has already been stored
        if (sessionStorage.getItem('behanceProjects')) {

            _setPortfolioTemplate();

        } else {

            var that = this;
            $.getJSON(_behanceProjectsAPI(), function (projects) {
                var data = JSON.stringify(projects);
                sessionStorage.setItem('behanceProjects', data);
                that.setPortfolioTemplate();
            });

        }

        _isotopeInit();
      }
    }
  })();

  var Form = (function () {

    function _clientSideValidation () {
      var validated = true;
      $(".contact-form-container input, .contact-form-container textarea").each(function(){
          $(this).css('border-color','');
          if(!$.trim($(this).val())){ //if this field is empty
              $(this).css('border-color','red'); //change border color to red
              validated = false; //set do not proceed flag
          }
          //check invalid email
          var email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          if($(this).attr("name")=="email" && !email_reg.test($.trim($(this).val()))){
              $(this).css('border-color','red'); //change border color to red
              validated = false; //set do not proceed flag
          }
      });
      return validated;
    }

    return {
      init : function () {

        $(".submit-btn").click(function() {

            if (_clientSideValidation()) //everything looks good! proceed...
            {
                //get input field values data to be sent to server
                post_data = {
                    'user_name'     : $('input[name=name]').val(),
                    'user_email'    : $('input[name=email]').val(),
                    'subject'       : $('input[name=sujet]').val(),
                    'msg'           : $('textarea[name=textarea]').val()
                };

                //Ajax post data to server
                $.post('contact-me.php', post_data, function(response){
                    if(response.type == 'error'){ //load json data from server and output message
                        output = '<p class="error">'+response.text+'</p>';
                    }else{
                        output = '<p class="success">'+response.text+'</p>';
                        //reset values in all input fields
                        $(".contact-form-container  input, .contact-form-container textarea").val('');
                        //$(".contact-form-container #contact_body").slideUp(); //hide form after success
                    }
                    $(".contact-form-container").html(output);
                }, 'json');
            }
        });

        //reset previously set border colors and hide all message on .keyup()
        $("#contact_form  input[required=true], #contact_form textarea[required=true]").keyup(function() {
            $(this).css('border-color','');
            $("#result").slideUp();
        });

        $('input').on('focus',function(){
          $(this).parent().addClass('input--filled');
        });
        $('input').on('blur',function(){

          if ($(this).val() === ''){
            $(this).parent().removeClass('input--filled');
          }
        });
      }
    }
  })();

  Portfolio.init();
  Form.init();


});
