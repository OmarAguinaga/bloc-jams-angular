(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
        /**
        * @desc Album object
        * @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();
        
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;
        
        /**
        * @function getSongIndex
        * @desc Finds index in the song property of the album object
        * @param {Object} song
        */
        var getSongIndex = function(song){
            return currentAlbum.songs.indexOf(song);
        }
        
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song){
            
            if(currentBuzzObject){
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });
            
             SongPlayer.currentSong = song;
        };
        
        /**
        * @function playSong
        * @desc Play currentBuzzObject and Set the playing property of the song object to true
        * @param {Object} song
        */
        var playSong = function(song){
            currentBuzzObject.play(); 
            song.playing = true;
        };
        
        /**
        * @function stopSong
        * @desc Stop currentBuzzObject and Set the playing property of the song object to false
        * @param {Object} song
        */
        var stopSong = function(song){
            currentBuzzObject.stop(); 
            song.playing = null;
        };
        
        /**
        * @desc public attribute for currentSong
        * @type {Object}
        */
        SongPlayer.currentSong = null;
        
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;
        
        /**
        * @desc Current volume of currently playing song
        * @type {Number}
        */
        SongPlayer.volume = 80;
        
        /**
        * @desc Max volume
        * @type {Number}
        */
        SongPlayer.maxVolume = 100;

        /**
        * @function play
        * @desc play action
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if(SongPlayer.currentSong !== song ){
                
                setSong(song);   
                playSong(song);
            }
            else if(SongPlayer.currentSong === song){
                if(currentBuzzObject.isPaused()){
                    playSong(song);
                }
            }
        };
        
        /**
        * @function pause
        * @desc pause action
        * @param {Object} song
        */
        SongPlayer.pause = function(song){
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function previous
        * @desc go to previous song
        */
        SongPlayer.previous = function(){
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            var maxSongs =  Object.keys(currentAlbum.songs).length;
            
            /*loop through songs*/
            currentSongIndex = (--currentSongIndex + maxSongs)%maxSongs;
            
            var song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);  
            
            /*if(currentSongIndex < 0){
                stopSong(song);
            }else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }*/
        }
        
        /**
        * @function next
        * @desc go to next song
        */
        SongPlayer.next = function(){
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            var maxSongs =  Object.keys(currentAlbum.songs).length;

            /*loop through songs*/
            currentSongIndex = (++currentSongIndex + maxSongs)%maxSongs;

            var song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);  
        }
        
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        
        SongPlayer.setVolume = function(volume){
            if (currentBuzzObject){
                currentBuzzObject.setVolume(volume);
            }
        };

        
        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();