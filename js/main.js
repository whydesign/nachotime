$(function(){

	$(document).on('click', 'a.imdb, a.youtube', function(a) {
		var url;

		a.preventDefault();
		url = $(this).attr('href');
		window.open(url, '_system');
	});

	if(localStorage['isUser']) {}
	else {
		localStorage['isUser'] = 1;
		localStorage['myDB'] = '{"genres":[{"id":28,"name":"Action","movie": []},{"id":12,"name":"Adventure","movie": []},{"id":16,"name":"Animation","movie": []},{"id":35,"name":"Comedy","movie": []},{"id":80,"name":"Crime","movie": []},{"id":105,"name":"Disaster","movie": []},{"id":99,"name":"Documentary","movie": []},{"id":18,"name":"Drama","movie": []},{"id":82,"name":"Eastern","movie": []},{"id":2916,"name":"Erotic","movie": []},{"id":10751,"name":"Family","movie": []},{"id":10750,"name":"Fan Film","movie": []},{"id":14,"name":"Fantasy","movie": []},{"id":10753,"name":"Film Noir","movie": []},{"id":10769,"name":"Foreign","movie": []},{"id":36,"name":"History","movie": []},{"id":10595,"name":"Holiday","movie": []},{"id":27,"name":"Horror","movie": []},{"id":10756,"name":"Indie","movie": []},{"id":10402,"name":"Music","movie": []},{"id":22,"name":"Musical","movie": []},{"id":9648,"name":"Mystery","movie": []},{"id":10754,"name":"Neo-noir","movie": []},{"id":1115,"name":"Road Movie","movie": []},{"id":10749,"name":"Romance","movie": []},{"id":878,"name":"Science Fiction","movie": []},{"id":10755,"name":"Short","movie": []},{"id":9805,"name":"Sport","movie": []},{"id":10758,"name":"Sporting Event","movie": []},{"id":10757,"name":"Sports Film","movie": []},{"id":10748,"name":"Suspense","movie": []},{"id":10770,"name":"TV movie","movie": []},{"id":53,"name":"Thriller","movie": []},{"id":10752,"name":"War","movie": []},{"id":37,"name":"Western"}]}';
	}

	$('.add_movie').on('click', function() {
		$('.get_backup').hide();
		var isOpen = $( ".kill_dialog" ).is(':visible');
		if(isOpen) {
			$('.kill_dialog').dialog('close');
			$('.kill_bg').hide();
		}
		$(".new_movie .wrapper").css("position","absolute");
		$(".new_movie .wrapper").css("top", (($('.content').height() - $(".new_movie .wrapper").outerHeight()) / 2) + $('.content').scrollTop() + "px");
		$(".new_movie .wrapper").css("left", (($('.content').width() - $(".new_movie .wrapper").outerWidth()) / 2) + $('.content').scrollLeft() + "px");
		$('.new_movie').fadeToggle();
		$('.close_entry').on('click', function() {
			$('.new_movie').fadeOut();
		});
	});

	$('.kill').on('click', function() {
		$('.kill_bg').fadeToggle();
		$('.kill_dialog').dialog({
	      	resizable: false,
	      	height:100,
	      	modal: true,
	      	position: { 
	      		my: "center", 
	      		at: "center", 
	      		of: '.content' 
	      	},
	      	buttons: {
	        	"Delete": function() {
	          		$( this ).dialog( "close" );
				    localStorage.removeItem('myDB');
					localStorage.removeItem('myMovies');
					localStorage.removeItem('isUser');
					document.location.reload(true);
	        },
	        	Cancel: function() {
	          		$( this ).dialog( "close" );
	          		$('.kill_bg').fadeToggle();
	        	}
	      	}
	    });
	});

	$('.love').on('click', function() {
		$('.kill_bg').fadeToggle();
		$('.about_dialog').dialog({
	      	resizable: false,
	      	height:100,
	      	modal: true,
	      	position: { 
	      		my: "center", 
	      		at: "center", 
	      		of: '.content' 
	      	},
	      	buttons: {
	        	Thanks: function() {
	          		$( this ).dialog( "close" );
	          		$('.kill_bg').fadeToggle();
	        	}
	      	}
	    });
	});

	var tmdbApiKey = '08cb5cefe1768c13ad8266971ccc1d32';
	var myMovieDB = JSON.parse(localStorage['myDB']);

	$.each(myMovieDB.genres, function(i, genre) {
		$('.sidebar ul').append('<li data-value="' + genre.id + '">' + genre.name + '</li>');
	});

	$('.submit_imdbid').on('click', function() {
		var imdbID = $('.new_movie .wrapper input').val();
		if(imdbID) {
			$.getJSON('http://api.themoviedb.org/3/movie/' + imdbID + '?api_key=' + tmdbApiKey)
			.success(function(movie) { 
				var movieGenres = movie.genres;
				var movieID = movie.id;

				$('.entry_id').fadeToggle();

				$.each(movie.genres, function(w, genre) {
					var movieArray = JSON.parse(localStorage['myDB']);
					var movieIDs = genre.id;

					$.each(movieArray.genres, function(i, localGenre) {
						if(localGenre.id == movieIDs) {
							var movieArray = localStorage['myDB'];

							movieNewID = JSON.parse(movieArray);
							movieNewID.genres[i].movie.push(movieID);

							localStorage['myDB'] = JSON.stringify(movieNewID);
							$('.new_movie .wrapper input').val('');
						}
					});
				});	

				$('.entry_morenfo h1').html(movie.title).attr('data-value', movieID);
				$('.entry_morenfo').fadeToggle();	
			})
			.error(function(movie) { 
				$('.new_movie .error').html(JSON.parse(movie.responseText).status_message).fadeIn().delay(3000).fadeOut();
			});
		}
		else {
			$('.new_movie .error').html('There was no ID entered.').fadeIn().delay(3000).fadeOut();
		}
	});

	$('.send_jsonbak').on('click', function() {
		var genre_db = $('.genrejson').val();
		var mymovie_db = $('.moviejson').val();

		localStorage['myDB'] = genre_db;
		localStorage['myMovies'] = mymovie_db;

		$('.genrejson, .moviejson').val('');

		$('.get_backup').fadeToggle();		
	})
	
	$('.entry_morenfo .entry_opt>span').on('click', function() {
		$(this).parent('div').children('span').removeClass()
		$(this).addClass('selected');
	});

	$('.accept_entry').on('click', function() {					
		var qualiObj = $('.entry_opt:first .selected').text();
		var formatObj = $('.entry_opt:last .selected').text();
		var movieID = $('.entry_morenfo h1').attr('data-value');

		var movieArray = localStorage['myMovies'];
		var newMovie = [];

		if(movieArray) {
			newMovie = JSON.parse(movieArray);
		}

		newMovie.push({id: movieID, quali: qualiObj, format: formatObj, available: true});
		localStorage['myMovies'] = JSON.stringify(newMovie);
		$('.entry_id, .entry_morenfo').fadeToggle();

		$('.entry_opt').removeClass('selected');
	});	

	$('.onoffswitch-label').on('click', function () {
		var selectArray = JSON.parse(localStorage['myMovies']);
		var onoffID = $('#myonoffswitch').attr('value');

		if($(".onoffswitch-inner").hasClass('awarded')) {
			$(".onoffswitch-inner").removeClass('awarded');
		}
		else {
			$(".onoffswitch-inner").addClass('awarded');
		}

		$.each(selectArray, function(i, movie) {
			if(onoffID == movie.id) {
				if($('#myonoffswitch').is(':checked') == false) {
					var status = true;
				}
				else {
					var status = false;
				}
				selectArray[i].available = status;
				localStorage['myMovies'] = JSON.stringify(selectArray);
			}
		});
	});

	$('.json_backup').on('click', function() {
		$('.get_backup').fadeToggle();
	})

	if($("body").outerWidth() < 537) {
		$('.sidebar li, .add_movie').on('click', function() {
			$('.sidebar').hide('slide', {direction: 'left'}, 500);
			$('.menu_mobile').animate({left:'-=206px'}, 500);
			$('.loading').hide();
		});
	}
	$('.toggle_sidebar').on('click', function() {
		if($('.sidebar').is(':visible')) {
			$('.loading').fadeOut(500);
			$('.sidebar, .add_movie').hide('slide', {direction: 'left'}, 500);
			$('.menu_mobile').animate({left:'-=206px'}, 500);
			$('.load_svg').show();
		}
		else {
			$('.load_svg, .get_backup').hide();
			$('.sidebar, .add_movie').show('slide', {direction: 'left'}, 500);
			$('.menu_mobile').animate({left:'+=206px'}, 500);
			$('.loading').fadeIn(500);
		}
	});

	$('.sidebar li').on('click', function() {
		$('.movie_nfo').fadeOut();
		$('.get_backup').hide();

		var isOpen = $( ".kill_dialog" ).is(':visible');

		if(isOpen) {
			$('.kill_dialog').dialog('close');
			$('.kill_bg').hide();
		}

		$('.new_movie').fadeOut();

		$(".load_svg").css("position","absolute");
		$(".load_svg").css("top", (($('.content').height() - $(".load_svg").outerHeight()) / 2) + $('.content').scrollTop() + "px");
		$(".load_svg").css("left", (($('.content').width() - $(".load_svg").outerWidth()) / 2) + $('.content').scrollLeft() + "px");

		$('.content .list_movie, .content h2').remove();
		$('.sidebar li').removeClass('is_active');
		$(this).addClass('is_active');
		$('.loading').fadeIn('slow');

		var genreValue = $(this).attr('data-value');
		var movieArray = JSON.parse(localStorage['myDB']);
		var moviesArray = JSON.parse(localStorage['myMovies']);	

		if ($(this).attr('data-value') == 'all') {
			var maxEach = moviesArray.length -1;

			$.each(moviesArray, function(i, movie) {
				$.getJSON('http://api.themoviedb.org/3/movie/' + movie.id + '?api_key=' + tmdbApiKey)
				.success(function(movie) {
					var releaseDate = new Date(movie.release_date).getFullYear();

					$('.content').append('<div class="list_movie" data-value="' + movie.id + '"><div class="cover" style="background-image: url(http://image.tmdb.org/t/p/w370' + movie.poster_path + ')"><span>Awarded - Awarded - Awarded</span><span>Awarded - Awarded - Awarded</span></div><h1>' + movie.title + '</h1><span>' + releaseDate + '</span></div>');
					$('.list_movie').fadeIn(1500);
				})
				.complete(function(movie) {
					$('.list_movie').each(function(i, div) {
						var getMovieID = $(div).attr('data-value');
						var moreNFO = JSON.parse(localStorage['myMovies']);

						$.each(moreNFO, function(i, nfo) {
							if(getMovieID == nfo.id) {
								if(nfo.available == false) {
									$(div).addClass('showSpan');
								}
							}
						});
					});
				})
				.done(function(movie) {
					if(i == maxEach) {
						$('.loading').fadeOut('slow');

						$('.list_movie').on('click', function() {
							$('.translation img, .youtube, .imdb').remove();
							$('.rating span').removeClass('fill')
							$('.cast div:nth-child(2)').html('');
							$(".load_svg").css("position","absolute");
							$(".load_svg").css("top", (($('.movie_nfo').height() - $(".load_svg").outerHeight()) / 2) + $('.movie_nfo').scrollTop() + "px");
							$(".load_svg").css("left", (($('.movie_nfo').width() - $(".load_svg").outerWidth()) / 2) + $('.movie_nfo').scrollLeft() + "px");
							$('.loading').fadeIn('fast').delay(1500).fadeOut('slow');

							var getMovieID = $(this).attr('data-value');
							$('.onoffswitch-checkbox').attr('value', getMovieID);
							var moreNFO = JSON.parse(localStorage['myMovies']);

							$.getJSON('http://api.themoviedb.org/3/movie/' + getMovieID + '?api_key=' + tmdbApiKey)
							.success(function(movie) {
								var releaseDate = new Date(movie.release_date).getFullYear();

								if(movie.backdrop_path) {
									$('.movie_nfo').css({'background-image': 'url(http://image.tmdb.org/t/p/w1000' + movie.backdrop_path + ')'});
								}
								else {
									$('.movie_nfo').css({'background-image': 'url(images/backdrop_error.jpg)'});
								}

								$('.bigcover').css({'background-image': 'url(http://image.tmdb.org/t/p/w600' + movie.poster_path + ')'});
								$('.overview h1').html(movie.title);
								$('.overview .time').html(releaseDate + ' • ' + movie.runtime + ' min');
								$('.overview p').html(movie.overview);

								var voting = Math.floor(movie.vote_average / 2) + 1;
								var i = 1;

								while ( i <= voting ) {
									$('.rating span:nth-child(' + i + ')').addClass('fill');
									i++;
								}

								$.getJSON('http://api.themoviedb.org/3/movie/' + getMovieID + '/videos?api_key=' + tmdbApiKey)
								.success(function(teaser) {
									if(teaser.results.length > 0) {
										$.each(teaser.results, function(i, video) {
											if(video.site == 'YouTube' && video.type == 'Trailer') {
												$('.overview .ext_href').html('<a href="http://imdb.com/title/' + movie.imdb_id + '" target="_blank" class="imdb">Show on IMDB</a><div class="youtube" data-value="' + video.key + '">Watch Trailer</div>');
											}
											else {
												console.log('No Trailer');
											}
										});
									}
								})
								.complete(function() {
									$('.youtube').on('click', function() {
										$('.kill_bg').fadeToggle();
										var vidID = $('.youtube').attr('data-value');
										$('.trailer_dialog p iframe').attr('src', 'http:////www.youtube.com/embed/' + vidID + '?rel=0&autoplay=1&showinfo=0&controls=0&iv_load_policy=3&fmt=22')
										$('.trailer_dialog').dialog({
									      	resizable: false,
									      	height: 475,
											width: 735,
											maxWidth: 735,
                    						maxHeight: 475,
									      	modal: true,
									      	position: { 
									      		my: "center", 
									      		at: "center", 
									      		of: '.content' 
									      	},
									      	buttons: {
									        	Close: function() {
									          		$( this ).dialog( "close" );
									          		$('.kill_bg').fadeToggle();
									        	}
									      	}
									    });
									});
								});
							});
								
							$.getJSON('http://api.themoviedb.org/3/movie/' + getMovieID + '/translations?api_key=' + tmdbApiKey)
							.success(function(translang) {
								$.each(translang.translations, function(i, isolang) {
									var ISOName = isolang.iso_639_1.toUpperCase();
									var ISOFlag = 'images/flags/' + ISOName + '.png';
							
									$.ajax({
									    type: 'get',
									    url: ISOFlag,
									    success: function(data, textStatus, XMLHttpRequest){
									        $('.translation div:nth-child(2)').append(' <img src="' + ISOFlag + '">');
									    },
									    error:function (xhr, ajaxOptions, thrownError){}
									});
								});
							});

							$.each(moreNFO, function(i, nfo) {
								if(getMovieID == nfo.id) {
									$('.bigcover span:first').html(nfo.format);
									$('.bigcover span:last').html(nfo.quali);
							
									if(nfo.available == false) {
										$(".onoffswitch-inner").addClass('awarded');
									}
									else {
										$(".onoffswitch-inner").removeClass('awarded');
									}
								}
							});

							$.getJSON('http://api.themoviedb.org/3/movie/' + getMovieID + '/credits?api_key=' + tmdbApiKey)
							.success(function(cast) {
								$.each(cast.cast, function(i, casts) {
									$('.cast div:nth-child(2)').append(casts.name + ', ');
								});
							});

							$(".delete_movie").css("position","absolute");
							$(".delete_movie").css("top", (($('.bigcover').height() - $(".delete_movie").outerHeight()) / 2) + $('.bigcover').scrollTop() + "px");
							$(".delete_movie").css("left", (($('.bigcover').width() - $(".delete_movie").outerWidth()) / 2) + $('.bigcover').scrollLeft() + "px");
							$('.movie_nfo').fadeToggle();

							if($("body").outerWidth() > 537) {
								$(".movie_nfo .wrapper").css("margin-top", (($('.movie_nfo').height() - $(".movie_nfo .wrapper").outerHeight()) / 2) + $('.movie_nfo').scrollTop() + "px");

								if ((($('.movie_nfo').width() - $(".movie_nfo .wrapper").outerWidth()) / 2) + $('.movie_nfo').scrollLeft() < 0) {
									$(".movie_nfo .wrapper").css("margin-left", "0px");
								}
								else {
									$(".movie_nfo .wrapper").css("margin-left", (($('.movie_nfo').width() - $(".movie_nfo .wrapper").outerWidth()) / 2) + $('.movie_nfo').scrollLeft() - 40  + "px");
								}
							}

							$('.close_nfo').on('click', function() {
								$('.movie_nfo').fadeOut();
								$('.youtube, .imdb').remove();
								$('.list_movie').each(function(i, div) {
									var getMovieID = $(div).attr('data-value');
									var moreNFO = JSON.parse(localStorage['myMovies']);

									$.each(moreNFO, function(i, nfo) {
										if(getMovieID == nfo.id) {
											if(nfo.available == false) {
												$(div).addClass('showSpan');
											}
											else {
												$(div).removeClass('showSpan');
											}
										}
									});
								});
							});
						});
					}
				});
			});
		}
		else {
			$.each(movieArray.genres, function(i, genre) {
				if(genre.id == genreValue) {
					var maxEach = genre.movie.length -1;

					if (genre.movie.length > 0) {
						$.each(genre.movie, function(i, movie) {
							$.getJSON('http://api.themoviedb.org/3/movie/' + movie + '?api_key=' + tmdbApiKey)
							.success(function(movie) {
								var releaseDate = new Date(movie.release_date).getFullYear();

								$('.content').append('<div class="list_movie" data-value="' + movie.id + '"><div class="cover" style="background-image: url(http://image.tmdb.org/t/p/w370' + movie.poster_path + ')"><span>Awarded - Awarded - Awarded</span><span>Awarded - Awarded - Awarded</span></div><h1>' + movie.title + '</h1><span>' + releaseDate + '</span></div>');
								$('.list_movie').fadeIn(1500);
							})
							.complete(function(movie) {
								$('.list_movie').each(function(i, div) {
									var getMovieID = $(div).attr('data-value');
									var moreNFO = JSON.parse(localStorage['myMovies']);

									$.each(moreNFO, function(i, nfo) {
										if(getMovieID == nfo.id) {
											if(nfo.available == false) {
												$(div).addClass('showSpan');
											}
										}
									});
								});
							})
							.done(function(movie) {
								if(i == maxEach) {
									$('.loading').fadeOut('slow');

									$('.list_movie').on('click', function() {
										$('.translation img, .youtube, .imdb').remove();
										$('.rating span').removeClass('fill');
										$('.cast div:nth-child(2)').html('');
										$(".load_svg").css("position","absolute");
										$(".load_svg").css("top", (($('.movie_nfo').height() - $(".load_svg").outerHeight()) / 2) + $('.movie_nfo').scrollTop() + "px");
										$(".load_svg").css("left", (($('.movie_nfo').width() - $(".load_svg").outerWidth()) / 2) + $('.movie_nfo').scrollLeft() + "px");
										$('.loading').fadeIn('fast').delay(1500).fadeOut('slow');

										var getMovieID = $(this).attr('data-value');
										$('.onoffswitch-checkbox').attr('value', getMovieID);
										var moreNFO = JSON.parse(localStorage['myMovies']);

										$.getJSON('http://api.themoviedb.org/3/movie/' + getMovieID + '?api_key=' + tmdbApiKey)
										.success(function(movie) {
											var releaseDate = new Date(movie.release_date).getFullYear();
											
											if(movie.backdrop_path) {
												$('.movie_nfo').css({'background-image': 'url(http://image.tmdb.org/t/p/w1000' + movie.backdrop_path + ')'});
											}
											else {
												$('.movie_nfo').css({'background-image': 'url(images/backdrop_error.jpg)'});
											}

											$('.bigcover').css({'background-image': 'url(http://image.tmdb.org/t/p/w600' + movie.poster_path + ')'});
											$('.overview h1').html(movie.title);
											$('.overview .time').html(releaseDate + ' • ' + movie.runtime + ' min');
											$('.overview p').html(movie.overview);

											var voting = Math.floor(movie.vote_average / 2) + 1;
											var i = 1;

											while ( i <= voting ) {
											    $('.rating span:nth-child(' + i + ')').addClass('fill');
											    i++;
											}


											$.getJSON('http://api.themoviedb.org/3/movie/' + getMovieID + '/videos?api_key=' + tmdbApiKey)
											.success(function(teaser) {
												if(teaser.results.length > 0) {
													$.each(teaser.results, function(i, video) {
														if(video.site == 'YouTube' && video.type == 'Trailer') {
															$('.overview .ext_href').html('<a href="http://imdb.com/title/' + movie.imdb_id + '" target="_blank" class="imdb">Show on IMDB</a><div class="youtube" data-value="' + video.key + '">Watch Trailer</div>');
														}
														else {
															console.log('No Trailer');
														}
													});
												}
											})
											.complete(function() {
												$('.youtube').on('click', function() {
													$('.kill_bg').fadeToggle();
													var vidID = $('.youtube').attr('data-value');
													$('.trailer_dialog p iframe').attr('src', 'http:////www.youtube.com/embed/' + vidID + '?rel=0&autoplay=1&showinfo=0&controls=0&iv_load_policy=3&fmt=22')
													$('.trailer_dialog').dialog({
												      	resizable: false,
												      	height: 475,
												      	width: 735,
												      	maxWidth: 735,
                    									maxHeight: 475,
												      	modal: true,
												      	position: { 
												      		my: "center", 
												      		at: "center", 
												      		of: '.content' 
												      	},
												      	buttons: {
												        	Close: function() {
												          		$( this ).dialog( "close" );
												          		$('.kill_bg').fadeToggle();
												        	}
												      	}
												    });
												});
											});
										});

										$.getJSON('http://api.themoviedb.org/3/movie/' + getMovieID + '/translations?api_key=' + tmdbApiKey)
										.success(function(translang) {
											$.each(translang.translations, function(i, isolang) {
												var ISOName = isolang.iso_639_1.toUpperCase();
												var ISOFlag = 'images/flags/' + ISOName + '.png';

												$.ajax({
												    type: 'get',
												    url: ISOFlag,
												    success: function(data, textStatus, XMLHttpRequest){
												        $('.translation div:nth-child(2)').append(' <img src="' + ISOFlag + '">');
												    },
												    error:function (xhr, ajaxOptions, thrownError){}
												});
											});
										});

										$.each(moreNFO, function(i, nfo) {
											if(getMovieID == nfo.id) {
												$('.bigcover span:first').html(nfo.format);
												$('.bigcover span:last').html(nfo.quali);

												if(nfo.available == false) {
													$(".onoffswitch-inner").addClass('awarded');
												}
												else {
													$(".onoffswitch-inner").removeClass('awarded');
												}
											}
										});

										$.getJSON('http://api.themoviedb.org/3/movie/' + getMovieID + '/credits?api_key=' + tmdbApiKey)
										.success(function(cast) {
											$.each(cast.cast, function(i, casts) {
												$('.cast div:nth-child(2)').append(casts.name + ', ');
											});
										});

										$(".delete_movie").css("position","absolute");
										$(".delete_movie").css("top", (($('.bigcover').height() - $(".delete_movie").outerHeight()) / 2) + $('.bigcover').scrollTop() + "px");
										$(".delete_movie").css("left", (($('.bigcover').width() - $(".delete_movie").outerWidth()) / 2) + $('.bigcover').scrollLeft() + "px");
										$('.movie_nfo').fadeToggle();

										if($("body").outerWidth() > 537) {
											$(".movie_nfo .wrapper").css("margin-top", (($('.movie_nfo').height() - $(".movie_nfo .wrapper").outerHeight()) / 2) + $('.movie_nfo').scrollTop() + "px");

											if ((($('.movie_nfo').width() - $(".movie_nfo .wrapper").outerWidth()) / 2) + $('.movie_nfo').scrollLeft() < 0) {
												$(".movie_nfo .wrapper").css("margin-left", "0px");
											}
											else {
												$(".movie_nfo .wrapper").css("margin-left", (($('.movie_nfo').width() - $(".movie_nfo .wrapper").outerWidth()) / 2) + $('.movie_nfo').scrollLeft() - 40  + "px");
											}
										}

										$('.close_nfo').on('click', function() {
											$('.movie_nfo').fadeOut();
											$('.youtube, .imdb').remove();
											$('.list_movie').each(function(i, div) {
												var getMovieID = $(div).attr('data-value');
												var moreNFO = JSON.parse(localStorage['myMovies']);

												$.each(moreNFO, function(i, nfo) {
													if(getMovieID == nfo.id) {
														if(nfo.available == false) {
															$(div).addClass('showSpan');
														}
														else {
															$(div).removeClass('showSpan');
														}
													}
												});
											});
										});
									});
								}
							});
						});
					}
					else {
						$('.content').append('<h2>There are no movie in this genre!</h2>');
						$(".content h2").css("position","absolute");
						$(".content h2").css("top", (($('.content').height() - $(".content h2").outerHeight()) / 2) + $('.content').scrollTop() + "px");
						$(".content h2").css("left", (($('.content').width() - $(".content h2").outerWidth()) / 2) + $('.content').scrollLeft() + "px");
					}
				}
			});
		}
	});
});