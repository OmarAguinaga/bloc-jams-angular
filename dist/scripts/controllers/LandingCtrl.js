(function(){
    function LandingCtrl(){
        this.heroTitle = "Turn the Music Up!";
    }
    angular
        .module('blocJams')
        .controller('LandingCrtl', LandingCtrl); //(name of cotroller, callback function)
        
})();