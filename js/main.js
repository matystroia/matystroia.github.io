let comment;
let deferred;
let playerDeferred;

let $main;
let $picture;
let $name;
let $comment;
let $comment_span;

let player;

function loadIframeApi() {
    let tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: $(window).height(),
        width: $(window).width(),
        playerVars: {'controls': 0},
        events: {
            'onStateChange': onPlayerStateChange,
            'iv_load_policy': 3
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        $('#player').css('display', '');
        player.unMute();
        playerDeferred.resolve();
    }
}


function showComment() {
    console.log('sent request');
    $.getJSON('https://romani-pe-youtube.herokuapp.com?q=' + $('#query').text(), function (json) {
        console.log('received response');

        player.loadVideoById(json['videoId'], json['videoLength'] / 2 - 3);

        $('#name-span').html('<strong>' + json['name'] + '</strong>' + ' spune:');
        $picture.attr('src', json['profilePicture']).load('load', checkCommentLoad);
        comment = json['comment'];
        $comment_span.html(comment);
    });
}

function checkCommentLoad() {
    playerDeferred.done(function () {
        setTimeout(function () {
            fillText();

            $main.css('left', '');

            $picture.addClass('grow-class');
            $comment.addClass('grow-class-2');
            $name.addClass('grow-class-2');

            let typeInstance = new TypeIt('#comment-span', {
                strings: comment,
                speed: 50,
                autoStart: false,
                cursor: false
            });

            checkTypeComplete(typeInstance);
        }, 500);
    });
}

function checkTypeComplete(typeInstance) {
    if (!typeInstance.isComplete)
        return setTimeout(function () {
            checkTypeComplete(typeInstance);
        }, 150);

    setTimeout(function () {
        $picture.attr('class', 'shrink-class');
        $comment.attr('class', 'comment-item shrink-class-2');
        $name.attr('class', 'name-item shrink-class-2');
    }, 1000 * 6);
}

function fillText() {
    $name.textfill({
        maxFontPixels: 100
    });

    $comment.textfill({
        maxFontPixels: 100,
        complete: function () {
            $comment_span.html('');
            $comment_span.css('color', 'rgba(0,0,0,255)');
            // $comment_span.css('font-size', $('#comment-span').css('font-size').split('px')[0] - 2);
        }
    });
}

function resetElements() {
    if (player !== undefined) {
        $('#player').css('display', 'none');
        player.mute();
    }

    $('#main').css('left', '-100%');

    $picture.attr('class', '');
    $comment.attr('class', 'comment-item');
    $name.attr('class', 'name-item');

    $comment_span.css('color', 'rgba(0,0,0,0)');
    $comment_span.html('');
    $comment_span.css('font-size', '');

    $('#name-span').html('').css('font-size', '');

    $picture.attr('src', 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=')
}

function newDeferred() {
    resetElements();

    deferred = $.Deferred();

    playerDeferred = $.Deferred();
    showComment();

    deferred.done(function () {
        newDeferred();
    });
}

$(window).on('load', function () {
    loadIframeApi();

    $main = $('#main');
    $picture = $('#picture');
    $name = $('#name');
    $comment = $('#comment');
    $comment_span = $('#comment-span');

    $("#query").keypress(function (e) {
        return e.which !== 13;
    });

    $picture.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
        if (e.originalEvent.animationName === "shrink") {
            deferred.resolve();
        }
    });

    newDeferred();
});
