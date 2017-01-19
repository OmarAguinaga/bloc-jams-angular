(function() {
    function SongPlayer(Fixtures) {
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
        * @desc public attribute for currentSong
        * @type {Object}
        */
        SongPlayer.currentSong = null;

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
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }*/
        }

        
        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', SongPlayer);
})();