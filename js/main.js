var apiKey  = 'zdinRP5GJarvCOa3PWiQxYb94dPyc9Xx';
var userID  = 'hellovincent';

var $container = $('.portfolio-container')

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