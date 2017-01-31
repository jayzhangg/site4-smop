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

function openNewUser() {
	$('#newUserButton').hide();
	$('#loginButton').hide();
	$('#newUserForm').show();
}
$('#passCheck').on('keyup', function () {
	if ($('#pass').val() == $('#passCheck').val()) {
		$('#passwordError').hide();
	}
	else $('#passwordError').show();
});
// Pre Load Function
(function () {
	$('#heroImage').html('Good ' + getHour() + '.');
	$('#loginForm').hide();
	$('#passwordError').hide();
	$('#newUserForm').hide();
})();
$(document).ready(function () {
	//all js that happens after load
	var timeoutID = null;
	// on type into
	$('.customInput').keyup(function () {});
});