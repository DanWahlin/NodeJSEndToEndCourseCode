codeWithDan.videoPreviewManager = function() {
    //http://developer.vimeo.com/player/js-api

    var apiString = '?api=1&player_id=videoPlayer&color=547DFD',
        iFrame,
        player,
        startVideo = false,
        isMobile = codeWithDan.helpers.isMobile(),
        modalVideo,
        modalVideoTitle,
/*        iFrameHtmlStart = '<iframe id="videoPlayer" class="embed-responsive-item" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen ',
        iFrameHtmlEnd = '></iframe>',*/

        init = function() {
            iFrame = $('#videoPlayer');
            if (!iFrame.length) return;

            modalVideo = $('#modalVideo');
            modalVideoTitle = $('#modalVideoTitle');
            if (isMobile) modalVideo.removeClass('fade'); //Eliminate modal transition on mobile

            wireEvents();
        },

        wireEvents = function() {
            $('.video-preview-link').click(playVideo);

            modalVideo.on('hide.bs.modal', function (e) {
                player.api('unload');
            });
        },

        videoReady = function() {
            if (startVideo) {
                if (!isMobile) {
                    player.api('play');
                }
                startVideo = false;
            }
        },

        playVideo = function() {
            var videoUrl = $(this).attr('data-videourl') + apiString;
            var videoTitle = $(this).attr('data-videoTitle');
            iFrame.attr('src', videoUrl);
            startVideo = true;

            if (!player) {
                iFrame.load(function() {
                    player = $f(iFrame[0]);
                    player.addEvent('ready', videoReady);
                });
            }

            modalVideoTitle.html(videoTitle);
            modalVideo.modal('show');

            //$('html, body').animate({scrollTop: iFrame.offset().top - 150}, 2000);
        };

    return {
        init: init
    };

}();

codeWithDan.videoPreviewManager.init();
