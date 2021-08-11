/*
 *	Program utilizes Product Quick View modal by CodyHouse.co (https://codyhouse.co/gem/css-product-quick-view)
 *  However, I have edited the file extensively to provide necessary functionality
 */

jQuery(document).ready(function ($) {
	//final width --> this is the quick view image slider width
	//maxQuickWidth --> this is the max-width of the quick-view panel
	var sliderFinalWidth = 400,
		maxQuickWidth = 900;

	//open the quick view panel
	$('.cd-trigger').on('click', function (event) {
		// get selected image and its source
		var selectedImage = $(this).parent('.cd-img-trigger').children('img'),
			selectedImageUrl = selectedImage.attr('src'),
			selectedTitle = $(this).parent('.cd-img-trigger').parent('.cd-item').find('.cookie-name');

		// Add the overlay-layer CSS class to body
		$('body').addClass('overlay-layer');

		// Ensures selected element contains correct URL
		selectedElement = $('.cd-quick-view').find('.selected').children('img').attr('class');
		// if cookie image is split (ends in 'S'), set selectedImageUrl2 to whole cookie image
		if (selectedImageUrl.substring(selectedImageUrl.length - 5, selectedImageUrl.length) == 'S.png') {
			selectedImageUrl2 = (selectedImageUrl.substring(0, selectedImageUrl.length - 5)) + 'W.png';
			if (selectedElement == 'img1') {
				$('.cd-quick-view').find('.img1').attr('src', selectedImageUrl);
				$('.cd-quick-view').find('.img2').attr('src', selectedImageUrl2);
			} else {
				$('.cd-quick-view').find('.img1').attr('src', selectedImageUrl2);
				$('.cd-quick-view').find('.img2').attr('src', selectedImageUrl);
            }
		} else {
			selectedImageUrl2 = (selectedImageUrl.substring(0, selectedImageUrl.length - 5)) + 'S.png';
			if (selectedElement == 'img1') {
				$('.cd-quick-view').find('.img1').attr('src', selectedImageUrl);
				$('.cd-quick-view').find('.img2').attr('src', selectedImageUrl2);
			} else {
				$('.cd-quick-view').find('.img1').attr('src', selectedImageUrl2);
				$('.cd-quick-view').find('.img2').attr('src', selectedImageUrl);
			}
		}
		// call animate quick view function with image, width, max width
		animateQuickView(selectedImage, sliderFinalWidth, maxQuickWidth, selectedTitle, 'open');

		//update the visible slider image in the quick view panel
		//you don't need to implement/use the updateQuickView if retrieving the quick view data with ajax
		//updateQuickView(selectedImageUrl);
	});

	//close the quick view panel
	$('body').on('click', function (event) {
		// if "X" or anywhere outside of quick view layer... close
		if ($(event.target).is('.cd-close') || $(event.target).is('body.overlay-layer')) {
			// closes quick view using widths
			closeQuickView( sliderFinalWidth, maxQuickWidth);
		}
	});

	// When key is released...
	$(document).keyup(function(event){
		//check if user has pressed 'Esc'
		if (event.which == '27') {
			// closes quick view using widths
			closeQuickView( sliderFinalWidth, maxQuickWidth);
		}
	});

	//quick view slider implementation
	// if next or previous buttons are pressed
	$('.cd-quick-view').on('click', '.cd-slider-navigation a', function () {
		updateSlider($(this));
	});

	//center quick-view on window resize, if quick view is visible 
	$(window).on('resize', function(){
		if($('.cd-quick-view').hasClass('is-visible')){
			window.requestAnimationFrame(resizeQuickView);
		}
	});


	function updateSlider(navigation) {
		$('.selected').css({
			"visibility": "",
		});
		var sliderContainer = navigation.parents('.cd-slider-wrapper').find('.cd-slider'),
			activeSlider = sliderContainer.children('.selected').removeClass('selected');
		if ( navigation.hasClass('cd-next') ) {
			if (!activeSlider.is(':last-child')) {
				activeSlider.next().addClass('selected');
			} else {
				sliderContainer.children('li').eq(0).addClass('selected');
			}
		} else {
			(!activeSlider.is(':first-child')) ? activeSlider.prev().addClass('selected') : sliderContainer.children('li').last().addClass('selected');
		} 
	}

	function updateQuickView(url) {
		$('.cd-quick-view .cd-slider li').removeClass('selected').find('img[src="'+ url +'"]').parent('li').addClass('selected');
	}

	// Resizes quick view window based on display width and height
	function resizeQuickView() {
		var quickViewLeft = ($(window).width() - $('.cd-quick-view').width())/2,
			quickViewTop = ($(window).height() - $('.cd-quick-view').height())/2;
		$('.cd-quick-view').css({
		    "top": quickViewTop,
		    "left": quickViewLeft,
		});
	} 

	// closes quick view window 
	function closeQuickView(finalWidth, maxQuickWidth) {
		var close = $('.cd-close'),
			activeSliderUrl = close.siblings('.cd-slider-wrapper').find('.selected img').attr('src'),
			selectedImage = $('.empty-box').find('img');
		//update the image in the gallery
		if( !$('.cd-quick-view').hasClass('velocity-animating') && $('.cd-quick-view').hasClass('add-content')) {
			selectedImage.attr('src', activeSliderUrl);
			animateQuickView(selectedImage, finalWidth, maxQuickWidth, 'close');
		} else {
			closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
		}
	}

	function animateQuickView(image, finalWidth, maxQuickWidth, title, animationType) {
		//store some image data (width, top position, ...)
		//store window data to calculate quick view panel position
		var parentListItem = image.parent('.cd-img-trigger'),
			topSelected = image.offset().top - $(window).scrollTop(),
			leftSelected = image.offset().left,
			widthSelected = image.width(),
			heightSelected = image.height(),
			windowWidth = $(window).width(),
			windowHeight = $(window).height(),
			finalLeft = (windowWidth - finalWidth) / 2;


		if (windowWidth < 992) {
		var finalHeight = finalWidth * heightSelected / widthSelected,
			finalTop = (windowHeight - finalHeight) / 4,
			quickViewWidth = 400;
		} else if ((windowWidth * .8) < maxQuickWidth) {
		var finalHeight = finalWidth * heightSelected / widthSelected,
			finalTop = (windowHeight - finalHeight) / 2,
			quickViewWidth = windowWidth * .8;
		} else {
		var finalHeight = finalWidth * heightSelected / widthSelected,
			finalTop = (windowHeight - finalHeight) / 2,
			quickViewWidth = maxQuickWidth;
		}
		quickViewLeft = (windowWidth - quickViewWidth) / 2;

		if( animationType == 'open') {
			//hide the image in the gallery
			parentListItem.addClass('empty-box');
			$('.selected').css({
				"visibility": "visible",
			});
			//place the quick view over the image gallery and give it the dimension of the gallery image
			$('.cd-quick-view').css({
			    "top": topSelected,
			    "left": leftSelected,
				"width": widthSelected,
			}).velocity({
				//animate the quick view: animate its width and center it in the viewport
				//during this animation, only the slider image is visible
			    'top': finalTop+ 'px',
			    'left': finalLeft+'px',
			    'width': finalWidth+'px',
			}, 1000, [ 400, 20 ], function(){
				//animate the quick view: animate its width to the final valu
				$('.cd-quick-view').addClass('animate-width').velocity({
					'left': quickViewLeft+'px',
			    	'width': quickViewWidth+'px',
				}, 300, 'ease' ,function(){
					//show quick view content
						$('.cd-quick-view').addClass('add-content');
						// Adding Cookie name as title
						var sliderTitle = document.getElementById('slider-title');
						sliderTitle.innerText = title[0].innerText;
				});
			}).addClass('is-visible');
		} else {
			//close the quick view reverting the animation
			$('.cd-quick-view').removeClass('add-content').velocity({
			    'top': finalTop+ 'px',
			    'left': finalLeft+'px',
			    'width': finalWidth+'px',
			}, 300, 'ease', function(){
				$('body').removeClass('overlay-layer');
				$('.cd-quick-view').removeClass('animate-width').velocity({
					"top": topSelected,
				    "left": leftSelected,
				    "width": widthSelected,
				}, 500, 'ease', function(){
					$('.cd-quick-view').removeClass('is-visible');
						parentListItem.removeClass('empty-box');
						$('.selected').css({
							"visibility": "hidden",
						});
				});
			});
		}
	}
	function closeNoAnimation(image, finalWidth, maxQuickWidth) {
		var parentListItem = image.parent('.cd-item'),
			topSelected = image.offset().top - $(window).scrollTop(),
			leftSelected = image.offset().left,
			widthSelected = image.width();

		$('body').removeClass('overlay-layer');
		parentListItem.removeClass('empty-box');
		$('.cd-quick-view').velocity("stop").removeClass('add-content animate-width is-visible').css({
			"top": topSelected,
		    "left": leftSelected,
		    "width": widthSelected,
		});
		$('.selected').css({
			"visibility": "hidden",
		});
	}
});