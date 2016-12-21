function isEquivalent(a, b) {
	// Create arrays of property names
	var aProps = Object.getOwnPropertyNames(a);
	var bProps = Object.getOwnPropertyNames(b);
	// If number of properties is different,
	// objects are not equivalent
	if (aProps.length != bProps.length) {
		return false;
	}
	for (var i = 0; i < aProps.length; i++) {
		var propName = aProps[i];
		// If values of same property are not equal,
		// objects are not equivalent
		if (a[propName] !== b[propName]) {
			return false;
		}
	}
	// If we made it this far, objects
	// are considered equivalent
	// fyi i stole this code -alex
	return true;
}

function openLogin() {
	$('#loginContainer').hide();
	$('#loginForm').show();
}

function login() {
	// fun fact, login: alex, password: </ugh>
	var userInput = {
		username: document.getElementById('user')['value']
		, password: document.getElementById('pass')['value']
	};
	var testLogin = {
		username: 'alex'
		, password: '</ugh>'
	};
	$('#loginForm').hide();
	if (isEquivalent(userInput, testLogin)) {
		window.location.href = "options";
	}
	else {
		$('#logInOut').append('well... I mean you could have tried to remember your password...');
	}
}

function getHour() {
	var date = new Date();
	var hour = +date.getHours();
	if (hour <= 4 || hour > 18) {
		return 'evening';
	}
	else if (hour <= 11) {
		return 'morning';
	}
	else if (hour <= 18) {
		return 'afternoon';
	}
	else {
		return 'time error... wut.'
	}
}
// On Load Function
(function () {
	$('#heroImage').html('Good ' + getHour() + '.');
	$('#loginForm').hide();
})();
$(document).ready(function () {
	//all js that happens after load
	var timeoutID = null;
	// on type into
	$('.customInput').keyup(function () {});
});