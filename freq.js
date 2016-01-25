var data = []

var freq = {}


data.forEach(function(tweet, index) {
  var text = tweet.text.toLowercase()
  var words = text.split(' ')
  words.forEach(function(word) {
    if (freq[word]) {
      freq[word]++
    } else {
      freq[word] = 1
    }
  })
});
