LiveReload = {
    filestowatch: [],
    base: location.protocol+'//'+location.hostname+location.pathname,
    active: false,
    timeout: null,
    numChecks: 0,
    maxChecks: 100,
    init: function() {
        var self = this;

        $('body').append('<a href="#" class="liveReload" style="position:fixed; bottom:0; right:0;">Live Reload (&gt;)</a>')
        $('body').delegate('a.liveReload', 'click', function(ev) {
            ev.preventDefault();
            self.reenableCheck();
        });

        $('link').each(function(i,e){
            var $element = $(e),
                src      = $element.attr('src') || $element.attr('href'),
                media    = $element.attr('media') || 'screen';

            if(src && !src.match(/^http/) && !src.match(/^\/\//)){
                self.filestowatch.push({
                    "src": src,
                    "mod": 0,
                    "media": media
                });
            }
        });

        this.check();
    },
    check: function () {
        var self = this;
        self.numChecks++;
        if (self.numChecks >= self.maxChecks) {
            self.stopCheck('max checks')
        } else {
            this.active = true;
            $.post("/livereload.php", { base: this.base, filestowatch: this.filestowatch }, function(data){
                if(data.files){
                    self.filestowatch = data.files;
                    if(data.reload) {
                        $.each(data.files, function(i,v) {
                            if ($('link[href^="'+v.src+'"]').length > 0) {
                                if (v.mod > 0) {
                                    $('link[href^="'+v.src+'"]').remove();
                                    $('head').append('<link rel="stylesheet" href="'+v.src+'?v='+(new Date()).getTime()+'" media="'+v.media+'" />');
                                }
                            }
                        });
                    }
                    $('a.liveReload').html('LiveReload (&gt;) ' + self.numChecks + '/' + self.maxChecks);
                    self.timeout = setTimeout(function() { self.check() }, 1000);
                }
            }, "json");
        }
    },
    bindKeys: function () {
        var self = this;
        $(document).bind({
            'keyup.livereload': function(event){
                if(event.ctrlKey && event.keyCode == 76){
                    if(self.active){
                        self.stopCheck('hotkey');
                    }else{
                        self.reenableCheck();
                    }
                };
            }
        });
    },
    stopCheck: function(reason) {
        reason = reason || '';
        clearTimeout(self.timeout);
        self.active = false;
        $('a.liveReload').html('LiveReload (||)');

        if(console)console.log('LiveReload is off, reason: ' + reason);
    },
    reenableCheck: function() {
        this.numChecks = 0;
        this.check();
        $('a.liveReload').html('LiveReload (&gt;)');

        if(console)console.log('LiveReload is on');
    }
};

$(function() {
    LiveReload.init();
});