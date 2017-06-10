// this is a test for a js file
function f1(a, b) {
	if (a == b) {
		return true;
	}
	return false;
}
var main = () => {
	return f1("a", 'a');
}
console.log(main());