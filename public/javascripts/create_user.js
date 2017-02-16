// Pre Load Function
(function () {
	$('#heroImage').html('Good ' + getHour() + '.');
	$('#passwordError').hide();
})();
// making the password error show
$('#passCheck').on('keyup', function () {
	if ($('#pass').val() == $('#passCheck').val()) {
		$('#passwordError').hide();
	}
	else $('#passwordError').show();
});
// for the hero image
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