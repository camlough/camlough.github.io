
jQuery(document).ready(function($){
	$('img[usemap]').maphilight({
        fillOpacity:.2,
        strokeColor:'000000',
        strokeWidth:1,
        fillColor:'ffffff'
    });
	//$('img[usemap]').rwdImageMaps();
});


jQuery(window).bind('resize', function(e)
{
    window.resizeEvt;
    jQuery(window).resize(function()
    {
        clearTimeout(window.resizeEvt);
        window.resizeEvt = setTimeout(function()
        {
            jQuery('img[usemap]').maphilight({
                fillOpacity:.2,
                strokeColor:'000000',
                strokeWidth:1,
                fillColor:'ffffff'
            });
        }, 250);
    });
});