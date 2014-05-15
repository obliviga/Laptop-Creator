$(document).ready(function () {
    $('.item input').each(function (i, el) {
        $(this).append(' <span class="diffaddsubtr"></span> <span class="diffamount"></span>');
    });
    updateSubtotal();
    updateDifferences();
});
$('.item').on('change', function (e) {
    updateSubtotal();
    updateDifferences();
});
	
test( "Checking if the subtotal is greater or equal to 1000", function updateSubtotal() {
	var subtotal = 1000;
	$('.item').each(function (i, el) {
        subtotal += parseFloat($(this).find('input:checked').data('price'));
    });
    $('.subtotal').text(subtotal);
    document.getElementById('cost').value = subtotal;
	ok( subtotal >= 1000, "Passed!" ); 
	return subtotal;
});


function updateDifferences() {
    $('.item').each(function (i, sel) {
        var $sel = $(sel);
        $sel.find('input').each(function (j, opt) {
            var $opt = $(opt),
                optprice = $opt.data('price'),
                selprice = $sel.find('input:checked').data('price'),
                diff = optprice - selprice,
                diffaddsubtr = (diff > 0) ? "- add" : (diff < 0) ? "- subtract" : "",
                diffamount = Math.abs(diff) || "";
            $opt.find('.diffaddsubtr').text(diffaddsubtr).end()
                .find('.diffamount').text(diffamount);
        });
    });
};
