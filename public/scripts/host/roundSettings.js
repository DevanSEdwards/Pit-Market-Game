function inputFilter(arg) {

    var max = parseInt(arg.max);
    var min = parseInt(arg.min);

    if (parseInt(arg.value) < min) {
        arg.value = min; 
    }
    else if (parseInt(arg.value) > max) {
        arg.value = max; 
    }
}

function resetEmptyValue(arg) {
    if (arg.value == "") {
        arg.value = 0;
    }
}