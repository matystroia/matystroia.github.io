var comment;

$.getJSON('https://romani-pe-youtube.herokuapp.com/', function(json, textStatus) {
	$('#name').html('<strong>' + json['name'] + '</strong>' + ' spune:');
	$('#picture').attr({src: json['profilePicture']});
	comment = json['comment'];
	$('#comment-span').html(comment);
});

function check() {
	if (!$('#picture').attr('src'))
		return setTimeout(check, 100);

	setTimeout(function() {
		$('#main').css('display', '');
		$('#comment').textfill({
			maxFontPixels: 60,
			complete: function() {
				$('#comment-span').html('');
				$('#comment-span').css('color', 'rgba(0,0,0,255)');
				$('#comment-span').css('font-size', $('#comment-span').css('font-size').split('px')[0] - 2);
			}
		});
		$('#picture').addClass('grow-class');
		$('#comment').addClass('grow-class-2');
		$('#name').addClass('grow-class-2');
		setTimeout(function() {
			new TypeIt('#comment-span', {
			     strings: comment,
			     speed: 50,
			     autoStart: false,
			     cursor: false
			});
		}, 700);
	}, 700);
}

check();