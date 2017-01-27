function openLogin() {
	$('#loginContainer').hide();
	$('#loginForm').show();
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
// Pre Load Function
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