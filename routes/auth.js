var db = require("../models");
var T = require('../config/twit-config');

module.exports = function(app, passport) {

    // HOME PAGE (with login links) ========
    app.get('/', function(req, res) {
      res.render('index.ejs'); // load the index.ejs file
    });


    // PROFILE SECTION =====================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
      res.render('profile.ejs', {
        user: req.user // get the user out of session and pass to template
      });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
      // if user is authenticated in the session, carry on
      if (req.isAuthenticated())
        return next();

      // if they aren't redirect them to the home page
      res.redirect('/');
    }

    // TWITTER ROUTES ======================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
      passport.authenticate('twitter', {
        successRedirect: '/search',
        failureRedirect: '/'
      }));

    // SEARCH ROUTES
    app.get('/search', function(req, res) {
      res.render('tweets/index');
    });

    //display user timeline
    app.get('/search_user', function(req, res) {

      T.get('statuses/user_timeline', {
        screen_name: `${req.query.q}`,
        count: 100
      }, function(err, data, response) {
        var freq = {};

        data.forEach(function(tweet, index) {
          var text = tweet.text.toLowerCase();
          var words = text.split(' ');
          words.forEach(function(word) {
            if (freq[word]) {
              freq[word]++;
            } else {
              freq[word] = 1;
            }
          });
        });
        var word_objects = [];
        for (var key in freq) {
          word_objects.push({
            size: freq[key] * 10,
            text: key
          });
        }
        res.status(200);
        res.send(word_objects);
      });

    });
}
