// Namespace
var mejs = mejs || {};
	
(function($){
	/***  PLAYLIST CONTROLS  ***/
	mejs.Playlist = function(player){
		var me 		 = this,
			c 		 = player.container,
			n  		 = player.$node,
			id 		 = n.attr('id'),
			clss 	 = n.attr('class').split(/\s+/),
			playlist = $('[id="'+id+'-list"]');
		
		// There is a playlist associated to the player
		if(playlist.length){
			// Set the playlist node
			me.playlist = playlist;
			
			// Set the playlist class
			me.playlist.addClass('emjs-playlist');
			
			// Set the skin class to playlist
			for(var i = 0, h = clss.length; i < h; i++){
				if(/\-skin/i.test(clss[i])){
					me.skin = clss[i];
					me.playlist.addClass(me.skin);
					break;
				}
			}

			// Player size
			me.playerWidth  = c.width();
			me.playerHeight = c.height();
			
			// Set the playlist width
			me.playlist.width(c.width());
			
			// The playlist loop was activated
			me.loop = (n.attr('loop')) ? true : false;
			
			// Set the player object associated to the playlist
			me.player = player;
			// Set the player id
			me.playerId = id;

			// Set a player wrapper
			//me.playerWrapper = me.player.container.wrap('<div id="'+id+'-wrapper"></div>').parent();

			// Associate click events to the playlist items
			$('li', me.playlist).click(function(){me.selectItem($(this));});

			// Playback the next playlist item
			me.player.media.addEventListener('ended', function (e) {
				me.playNext();
			}, false);
			
			// Associate the playist to the music player
			me.player.playlist = me;
		}	
	};

	mejs.Playlist.prototype = {
		playlist 		: null,
		player 			: null,
		playerId 		: '',
		//playerWrapper 	: null,
		playerWidth 	: null,
		playerHeight 	: null,
		attributes 		:{
			show : true
		},
		skin 			: null, 
		
		removePlayer : function(){
			var me = this;
			for(var i = 0, h = mejs.players.length; i < h; i++){
				if(mejs.players[i].$media[0].id == me.playerId){
					mejs.players[i].pause();
					mejs.players.splice(i,1);
					break;
				}
					
			}
			me.player.container.remove();
		},
		
		parseItem : function(item){
			var e;
			try{
				return $.parseJSON(item);
			}catch(e){
				return item;
			}
			
		},
		
		parseSrc : function(src){
			function adjustedSrc(v){
				var d = new Date();
				v += ((v.indexOf('?') == -1) ? '?' : '&cpmp=')+d.getTime();
				return v;
			};
			
			var source = '<source';
				
			if($.isPlainObject(src)){ // The src is an object 
				if(src.type) source += ' type="' + src.type + '"';
				if(src.src)  source += ' src="'  + adjustedSrc(src.src) + '"';
			}else { // The src is a string with media location
				source += ' src="' + adjustedSrc(src) + '"';
			}
			
			source += ' />';
			return source;
		},
		
		parseTrack : function(trck){
			var track = '<track';
			
			if($.isPlainObject(trck)){ // The trck is an object
				track += ' srclang = "' + ((trck.srclang) ? trck.srclang : 'en') + '"';
				track += ' kind = "'    + ((trck.kind)    ? trck.kind    : 'subtitles') + '"';
				if(trck.src) track += ' src="' + trck.src + '"'; 
			}else{ // The trck is a string with caption location
				track += ' kind="subtitles" srclang="en" src="' + trck + '"';
			}
			
			track += ' />';
			return track;
		},
		
		playItem : function(item){
			var me       = this,
				dim 	 = '',
				options  = me.player.options,
				isVideo  = me.player.isVideo,
				tag      = (isVideo) ? '<video' : '<audio';
			
			// Set ID
			tag += ' id="' + me.playerId + '"';
			
			// Set player size
			if(me.playerWidth){
				tag += ' width="' + me.playerWidth + '"';
			}	
			
			if(me.playerHeight){
				tag += ' height="' + me.playerHeight + '"';
			}	
			
			// Set the music player skin
			if(me.skin){
				tag += ' class="' + me.skin + '"';
			}
			
			if($.isPlainObject(item)){
				// Assign the poster
				if(item.poster){
					tag += ' poster="' + item.poster + '"';
				}
				
				tag += '>';
							
				// Assign sources
				if(item.source){
					if($.isArray(item.source)){ // many source formats
						$.each(item.source, function(i, src){
							tag += me.parseSrc(src);
						});
					}else{ // only one source
						tag += me.parseSrc(item.source);
					}
				}
				
				// Assign tracks
				if(item.track){
					if($.isArray(item.track)){ // many captions 
						$.each(item.track, function(i, track){
							tag += me.parseTrack(track);
						});
					}else{
						tag += me.parseTrack(item.track);
					}
				}
			}else{ // The item is a string with media source
				tag += ' src="' + item + '">';
			}
			
			tag += (isVideo) ? '</video>' : '</audio>';

			me.player.container.before(tag);
			//$(tag).appendTo(me.playerWrapper.empty());
			me.removePlayer();
			//me.playerWrapper.empty();
			
			
			// Set the success callback
			options['success'] = function(media, domNode, player) {
				me.player = player;
				me.player.playlist = me;
				me.player.media.addEventListener('ended', function (e) {
					me.playNext();
				}, false);
				me.player.load();
				me.player.play();
			};
			
			// Set the startVolume
			options['startVolume'] = me.player.media.volume;
			new MediaElementPlayer('[id="'+me.playerId+'"]', options);
		},
		
		/**
		 * playNext allow to play the next and previous items from playlist 
		 * if next argument is false the previous item is selected
		 */
		playNext : function(next){
			var me = this;
			
			// If playlist has fewer than  two elements, the buttons take no action
			if(me.playlist.find('li').length < 2)
				return;
			
			var	current_item = me.playlist.find('li.current:first'), // get the .current song
				item;
			
			if(typeof next == 'undefined') next = true;
			
			if (current_item.length == 0){ 
				current_item = me.playlist.find('li:first'); // get :first if we don't have .current class
			}
			
			//me.player.pause();
			
			if(current_item.length){ // If playlist is not empty
				if( ($(current_item).is(':last-child') && next) ||  ($(current_item).is(':first-child') && !next)) { // if it is last - stop playing or jump to the first item
					$(current_item).removeClass('current');
					if(me.loop){
						if(next){
							item = $('li:first', me.playlist).addClass('current')[0].getAttribute('value');
						}else{
							item = $('li:last', me.playlist).addClass('current')[0].getAttribute('value');
						}	
						me.playItem(me.parseItem(item));
					}		
				}else{ // take the next item to playback
					var next = (next) ? $(current_item).next() : $(current_item).prev(),
						item = next[0].getAttribute('value');
						
					next.addClass('current').siblings().removeClass('current');
					me.playItem(me.parseItem(item));
				}
			}
		},
		
		selectItem : function(item){
			var me = this;
			item.addClass('current').siblings().removeClass('current');
			var item = item[0].getAttribute('value');
			me.playItem(me.parseItem(item));
		}
	};
	
	/***  NEXT BUTTON CONTROL  ***/
	MediaElementPlayer.prototype.buildnext = function(player, controls, layers, media) {
        var
            // create the loop button
            next = 
            $('<div class="mejs-button mejs-next-button">' +
                '<button></button>' +
            '</div>')
            // append it to the toolbar
            .appendTo(controls)
            // add a click toggle event
            .click(function() {
				if(player.playlist)
					player.playlist.playNext();
            });    
    };
	
	/***  PREVIOUS BUTTON CONTROL  ***/
	MediaElementPlayer.prototype.buildprevious = function(player, controls, layers, media) {
        var
            // create the loop button
            next = 
            $('<div class="mejs-button mejs-previous-button">' +
                '<button></button>' +
            '</div>')
            // append it to the toolbar
            .appendTo(controls)
            // add a click toggle event
            .click(function() {
				if(player.playlist)
					player.playlist.playNext(false);
            });    
    };
	
	/***  EQ CONTROL  ***/
	MediaElementPlayer.prototype.buildeq = function(player, controls, layers, media) {
        var
            // create the eq bars
            eq = 
            $('<div class="eq" style="display:none">'+
				'<span class="bar"></span>'+
				'<span class="bar"></span>'+
				'<span class="bar"></span>'+
				'<span class="bar"></span>'+
				'<span class="bar"></span>'+
			  '</div>')	
            // append it to the toolbar
            .appendTo(controls);
			
        
		// Animate bars
		function fluctuate(bar, h) {
			var v = player.media.volume || 0,
				hgt = (Math.random()) * h * v,
				t = (hgt+1) * 30;
			
			if(media.paused || media.ended) {
				eq.hide();
			}else 
				if(media.currentTime){
					eq.show();
				}	
			
			bar.animate({
				height: hgt
			}, t, function() {
				fluctuate($(this), h);
			});
		}
		
		controls.find('.bar').each(function(i, bar){
			var b = $(bar),
				w = b.width(),
				h = b.height();
				
			b.css('left', (w*i+2*i)+'px');
			fluctuate(b, h);
		});
	};
	
	$('.codepeople-media').mediaelementplayer({
		features: ['previous','playpause','next','fullscreen','tracks','eq','current','progress','duration','volume'],
		videoVolume: 'horizontal',
		iPadUseNativeControls: false,
		iPhoneUseNativeControls: false, 
		success: function(media, node,  player) {
			new mejs.Playlist(player);
		}
	});
})(jQuery);

