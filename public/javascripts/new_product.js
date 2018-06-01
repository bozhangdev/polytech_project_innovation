let addStartTimeToAuction = function (choice) {
    let hiddentime = document.getElementById('start_time');
    if (choice === 'auction') {
        hiddentime.setAttribute('style', 'display: inline');
        var mytime="", now = new Date();
        mytime += (new Date()).toISOString().slice(0,10);
        mytime += "T";
        mytime += now.getHours() + ":"+now.getMinutes();
        document.getElementById("checkfortime").setAttribute('min', mytime);
        document.getElementById("checkfortime2").setAttribute('min', mytime);
    } else {
        hiddentime.setAttribute('style', 'display: none');
    }

};

let checkForm = function () {
    let form = document.getElementById('new_product_form');
    alert('tets');
    return false;
};