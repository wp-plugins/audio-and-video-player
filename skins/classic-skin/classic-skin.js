/* CLASSIC-SKIN */
var cp_skin_js = cp_skin_js || {};
cp_skin_js['classic-skin'] = function($){
    function resize(){
        $('.mejs-container.classic-skin').each(function(){
            var me = $(this);
            if( (me.find('video').length && me.width() < 515) || (me.find('audio').length && me.width() < 425)){
                var cc = me.find('.mejs-captions-button'),
                    ct = me.find('.mejs-currenttime-container'),
                    dc = me.find('.mejs-duration-container'),
                    p;
                    
                if(cc.length){
                    p = cc;
                }else{
                    if(me.hasClass('.silverlight') || me.find('audio').length){
                        p = me.find('.mejs-next-button');
                    }else{
                        p = me.find('.mejs-fullscreen-button');
                    }
                }
                
                ct.css({'left': (parseInt(p.css('left'))+p.width()+10)+'px', 'right': 'auto'});
                dc.css({'left': (parseInt(ct.css('left'))+50)+'px', 'right': 'auto'});
                me.find('.mejs-volume-button,.mejs-horizontal-volume-slider,.bar').hide();
                
            }else{
                var ct = me.find('.mejs-currenttime-container'),
                    dc = me.find('.mejs-duration-container');
                ct.attr('style', '');
                dc.attr('style', '');
                me.find('.mejs-volume-button,.mejs-horizontal-volume-slider,.bar').show();
            }        
            me.siblings('ul').width(me.width());
        });
    };
    resize();
    $(window).resize(function(){
       resize();
    });
       
};
/* END: CLASSIC-SKIN */
