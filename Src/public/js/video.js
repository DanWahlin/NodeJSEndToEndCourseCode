codeWithDan.videoManager = function() {
    //http://developer.vimeo.com/player/js-api

    var baseUrl = '/api/progress/',
        apiString = '?api=1&player_id=videoPlayer&color=547DFD',
        currentlyViewing = null,
        currentSectionDiv = null,
        iFrame,
        player,
        videoDuration,
        productAndProgress,
        //startVideo = false,
        seekToVideo = false,
        timerId = null,
        isMobile = codeWithDan.helpers.isMobile(),
        modalVideo,
        modalVideoTitle,


        init = function() {

            iFrame = $('#videoPlayer');
            if (!iFrame.length) return;

            modalVideo = $('#modalVideo');
            modalVideoTitle = $('#modalVideoTitle');
            if (isMobile) modalVideo.removeClass('fade'); //Eliminate modal transition on mobile

            wireEvents();
            getProductAndUserProgress();

        },

        wireEvents = function() {

            //Handle responsive tab functionality for mobile devices
            fakewaffle.responsiveTabs(['xs', 'sm']);

            $('.module-title').click(function () {
                var moduleId = $(this).attr('data-moduleId');
                $('.modules-container div[data-moduleId="' + moduleId + '"]').slideToggle(100);
            });

            $('.video-link').click(playVideo);

            modalVideo.on('hide.bs.modal', function (e) {
                player.api('unload');
            })

        },

        videoReady = function() {

            player.api('getDuration', function(duration) {
                videoDuration = duration;
            });

            player.addEvent('finish', function (id) {
                updateUserProgress('finished'); //User completed section
            });

            player.addEvent('play', function (id) {
                startTimer();
            });

            player.addEvent('playProgress', function (data, id) {
                currentlyViewing.currentVideoTime = data.seconds;
            });

            player.addEvent('pause', function (id) {
                stopTimer();
                updateUserProgress('setmarker');
            });

/*            if (startVideo) {
                if (!isMobile) {
                    player.api('play');
                    startTimer();
                }
                startVideo = false;
            }*/

            if (seekToVideo) {
                seekTo();
                seekToVideo = false;
            }

        },

        getProductAndUserProgress = function() {

            var productId = iFrame.attr('data-productId');

            $.get(baseUrl, { productId: productId }, function(progressData) {

                productAndProgress = progressData;
                currentlyViewing = progressData.currentlyViewing;

                if (currentlyViewing) {
                    currentlyViewing.initialLoad = true;
                    //changeVideoSrc(true, false); //seekTo but don't play
                    highlightCurrentVideo();
                }
                else {
                    var module = productAndProgress.product.modules[0],
                        section = module.sections[0];

                    setCurrentlyViewing(module.moduleId, section.sectionId, section.videoUrl);
                    changeVideoSrc(false, false); //don't seek to or play
                }

                if (productAndProgress.userProgress) {
                    //Update the completed indicator in the page for each completed section
                    var completedSections = productAndProgress.userProgress.completedSections;
                    for (var i=0;i< completedSections.length;i++) {
                        markCompleted(completedSections[i]);
                    }
                }
            });

        },

        playVideo = function() {
            var selectedDiv = $(this),
                moduleId = selectedDiv.attr('data-moduleId'),
                sectionId = selectedDiv.attr('data-sectionId'),
                videoUrl = getModuleAndSection(moduleId, sectionId).section.videoUrl,
                videoTitle = selectedDiv.attr('data-videoTitle');

            if (currentlyViewing && currentlyViewing.initialLoad) { //First time page has loaded
                currentlyViewing.initialLoad = false;
                changeVideoSrc(true, true);
            }
            else {
                setCurrentlyViewing(moduleId, sectionId, videoUrl);
                changeVideoSrc(false, true);
                updateUserProgress('setmarker');
            }

            //Display modal
            modalVideoTitle.html(videoTitle);
            modalVideo.modal('show');
        },


        changeVideoSrc = function(seekTo, play) {
            iFrame.attr('src', currentlyViewing.videoUrl + apiString);

            if (!player) { //Called first time a video is played
                iFrame.load(function() { //Important to wait for the frame to load first
                    player = $f(iFrame[0]);
                    player.addEvent('ready', videoReady);
                });
            }
            seekToVideo = seekTo;
            //startVideo = play;
            highlightCurrentVideo();
        },

        highlightCurrentVideo = function() {

            if (currentSectionDiv) currentSectionDiv.removeClass('currently-viewing-video');

            currentSectionDiv = $('div[data-sectionId="' + currentlyViewing.sectionId + '"]');
            currentSectionDiv.addClass('currently-viewing-video');

        },

        updateUserProgress = function(action) {

            var userProgress = currentlyViewing;
            userProgress.action = action;

            //console.log('updated progress with action: ' + action + ' ' + Date.now());
            $.post(baseUrl, { _csrf: codeWithDan.csrf, userProgress: userProgress }, function(opStatus) {
                if (action === 'finished') {
                    markCompleted(currentlyViewing.sectionId);
                    moveToNextVideo();
                }
            });

        },

        startTimer = function() {

            if (!timerId) { //Don't start it more than once
                timerId = setInterval(function () {
                    updateUserProgress('setmarker');
                }, 30000);
            }

        },

        stopTimer = function() {

            if (timerId) {
                clearInterval(timerId);
                timerId = null;
            }

        }

        markCompleted = function(sectionId) {

            $('span[data-sectionId="' + sectionId + '"]').addClass('fa-check');

        },

        seekTo = function() {
            //Move user where they were originally
            if (currentlyViewing) {
                var seekTo = currentlyViewing.currentVideoTime - 2;
                if (seekTo < 0) seekTo = 0;

                player.api('seekTo', seekTo);
                //Hack for IE and Firefox to make it pause instead of playing right away
                var timeoutId = setTimeout(function() {
                    //player.api('pause');
                    clearTimeout(timeoutId);
                }, 500);

            }
        },

        moveToNextVideo = function() {

            var next = findNextSection();
            if (next) {
                changeVideoSrc(false, true);
                updateUserProgress('setmarker');
            }
            else {
                stopTimer(); //On the last video
            }

        },

        getModuleAndSection = function(moduleId, sectionId) {
            var modules = productAndProgress.product.modules,
                moduleIndex = itemIndex(modules, 'moduleId', moduleId),
                sectionIndex = itemIndex(modules[moduleIndex].sections, 'sectionId', sectionId);

            return {
                moduleIndex: moduleIndex,
                module: modules[moduleIndex],
                sectionIndex: sectionIndex,
                section: modules[moduleIndex].sections[sectionIndex]
            };

        },

        findNextSection = function() {

            var currentModuleSection = getModuleAndSection(currentlyViewing.moduleId, currentlyViewing.sectionId),
                modules = productAndProgress.product.modules,
                moduleIndex = currentModuleSection.moduleIndex,
                sectionIndex = currentModuleSection.sectionIndex,
                module,
                section;

            //See if we can get the next section or need to move to next module, or if we're at the end
            if (modules[moduleIndex].sections.length - 1 > sectionIndex) {
                module = modules[moduleIndex];
                section = module.sections[sectionIndex + 1];
            }
            else {
                if (modules.length - 1 > moduleIndex) { //Are more modules left?
                    module = modules[moduleIndex + 1];
                    section = module.sections[0];
                }
            }

            if (module && section) {
                setCurrentlyViewing(module.moduleId, section.sectionId, section.videoUrl);
                return {module: module, section: section};
            }

            return null;

        },

        setCurrentlyViewing = function(moduleId, sectionId, videoUrl, currentVideoTime) {
            currentlyViewing = {
                productId           : productAndProgress.product._id,
                moduleId            : moduleId,
                sectionId           : sectionId,
                videoUrl            : videoUrl,
                currentVideoTime    : (currentVideoTime) ? currentVideoTime : 0
            };

        },

        itemIndex = function(array, propertyName, value) {
                if (!array) return -1;
                var pos;
                if (propertyName) {
                    pos = array.map(function (item) {
                        return item[propertyName].toString();
                    }).indexOf(value);
                }
                else {
                    pos = array.map(function (item) {
                        return item.toString();
                    }).indexOf(value);
                }
                return pos;
        };

    return {
        init: init
    };

}();

//Simple check - server re-verifies auth each request
if (codeWithDan.isAuthenticated) {
    codeWithDan.videoManager.init();
}
