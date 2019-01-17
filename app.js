// this is mock data, but when we create our API
// we'll have it return data that looks like this
var MOCK_WORKOUT_POSTS = {
	"workoutPosts": [
        {
            "id": "1111111",
            "type": "Floor",
            "length": 90,
            "calories": 150,
            "max hr": 135,
            "friendId": "aaaaaa",
            "friendName": "John Doe",
            "date": 1470016976609
        },
        { "id": "2222222",
            "type": "Rower",
            "length": 90,
            "calories": 250,
            "max hr": 140,
            "friendId": "aaaaaa",
            "friendName": "John Doe",
            "date": 1470016976608
        },
        {
             "id": "33333",
            "type": "Run",
            "length": 90,
            "calories": 550,
            "max hr": 175,
            "friendId": "aaaaaa",
            "friendName": "John Doe",
            "date": 1470016976607
        }
    ]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getWorkoutPosts(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_WORKOUT_POSTS)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayWorkoutPosts(data) {
    for (index in data.workoutPosts) {
	   $('body').append(
        '<p>' + data.workoutPosts[index].text + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayWorkoutPosts() {
	getWorkoutPosts(displayWorkoutPosts);
}

//  on page load do this
$(function() {
	getAndDisplayWorkoutPosts();
})