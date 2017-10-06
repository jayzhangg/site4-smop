function coder_home() {
	$.get('coder_home', {
		'ssn': ssn()
	});
}

function owner_home() {
	$.get('owner_home', {
		'ssn': ssn()
	});
}