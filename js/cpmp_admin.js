var cpmp = function($){
	// Messages
	var files_required 		= 'At least a Songs/Videos files must be entered',
		annotation_required = 'Please, enter the item title to identify it';
	
	// Extend array
	function inArray(a, v){
		for(var j in a){
			if(a[j] == v){
				return j;
			}	
		}
		return -1;
	}
	
	// Create the JSON object used through the project
	var JSON = JSON || {};
	
	// implement JSON.stringify serialization
	JSON.stringify = JSON.stringify || function (obj) {
		var t = typeof (obj);
		if (t != "object" || obj === null) {
			// simple data type
			if (t == "string") obj = '"'+obj+'"';
			return String(obj);
		}
		else {
			// recurse array or object
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			for (n in obj) {
				v = obj[n]; t = typeof(v);
				if (t == "string") v = '"'+v+'"';
				else if (t == "object" && v !== null) v = JSON.stringify(v);
				json.push((arr ? "" : '"' + n + '":') + String(v));
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	};
	
	// implement JSON.parse de-serialization
	JSON.parse = JSON.parse || function (str) {
		if (str === "") str = '""';
		eval("var p=" + str + ";");
		return p;
	};
		
	function is_empty(v){
		return /^\s*$/.test(v);
	}
	
	function display_item_form(){
		obj.clear_item_form();
		$('#item_form').show();
	}
	
	function set_skin(e, skin, width, height){
		e = $(e);
		$('.skin_selected').removeClass('skin_selected').css('border', '0px');
		e.addClass('skin_selected').css('border','1px dotted #CCC');
		$('input[name="cpmp_skin"]').val(skin);
		if(width){
			$('#cpmp_width_info').text('Value should be greater than or equal to:'+width);
			$('#cpmp_height_info').text('Value should be greater than or equal to:'+height);
		}
	}
	
	function load_additional_skins(data){
		var s 		= $('#skin_container'),
			title 	= ' - The Skin is included in the premium version of plugin';
		if(s.length){
				$.getJSON('http://www.tsplayer.com/cpmp_skins.php?callback=?', function(data){
				if(data){
					var skin_list = [];
					
					if(typeof cpmp_skin_list != 'undefined' && cpmp_skin_list){
						skin_list = cpmp_skin_list;
					}
		
	
					for(var i=0, h=data.length; i < h; i++){
						if(inArray(skin_list, data[i].id) == -1)
						s.append('<a href="'+data[i].link+'" target="_blank" style="margin-left:5px;"><img src="'+data[i].thumbnail+'" title="'+data[i].name+( ( !/custom\-skin\-commercial/i.test( data[i].thumbnail ) ) ? title : '' )+'" border="0" /></a>');
					}
				}
			});
		}
	}
	
	function remove_player(){
		$('#cpmp_action').val('remove').parents('form')[0].submit();;
	}
	
	function add_field(e, base){
		var id = new Date().getTime();
		
		var e  = $(e),
			p  = e.parent('div'),
			c  = p.clone(),
			l  = c.find('.thickbox');
		if(l.length)	
			l.attr('href', l.attr('href').replace(/container_id=[^&]+&/i, 'container_id='+base+id+'&'));
		c.find('.'+base).attr('id', base+id);
		c.find('input[type="text"]').val('');
		
		if(c.find('.remove_field').length == 0)	
			c.append('<input type="button" value="Remove this element" class="remove_field" onclick="cpmp.remove_field(this);">');
		
		p.after(c);
		return c;
	}
	
	function remove_field(e){
		$(e).parent('div').remove();
	}
	
	function add_item(){

		var item_id = $('#item_id').val();
		var annotation = $('#item_annotation').val(),
		item = {
			id 			: (item_id == "") ? new Date().getTime() : item_id,
			annotation 	: annotation.replace(/\"/g,"&quot;"),
			link	   	: $('#item_link').val().replace(/\"/g,"&quot;"),
			poster	   	: ($('#item_poster').length) ? $('#item_poster').val().replace(/\"/g,"&quot;") : "",
			files		: [],
			subtitles	: []
		};
		
		$('#item_form').find('.item_file').each(function(i, e){
			var v = $(this).val();
			if(!is_empty(v))
				item.files[i] = v.replace(/\"/g,"&quot;");
		});
		
		// Requirements
		if(is_empty(item.annotation)){
			alert(annotation_required);
			return;
		}
		
		if(item.files.length == 0){
			alert(files_required);
			return;
		}
		
		
		$('#item_form').find('.item_subtitle').each(function(i, e){
			var v = $(this).val();
			if(!is_empty(v)){
				item.subtitles[i] = {
					'link' : v.replace(/\"/g,"&quot;")
				};
				var l = $(this).next('.item_subtitle_lang').val();
				if(!is_empty(l)){
					item.subtitles[i]['language'] = l.replace(/\"/g,"&quot;");
				}else{
					l = v.substr(v.lastIndexOf('/')+1);
					var p = l.lastIndexOf('.');
					l = l.substr(0, ((p != -1) ? p: l.length));
					item.subtitles[i]['language'] = l.replace(/\"/g,"&quot;");
				}	
			}	
		});
		
		if(item_id == ''){ // Insert a new item
			obj.items.push(item);
			$('#items_container').append('<div id="'+item.id+'" class="playlist_item" style="cursor:pointer;"><input type="button" value="Up" onclick="cpmp.move_item(\''+item.id+'\', -1);" /><input type="button" value="Down" onclick="cpmp.move_item(\''+item.id+'\', 1);" /><input type="button" value="Delete item" onclick="cpmp.delete_item(\''+item.id+'\');"><span>'+annotation+'</span></div>');
		}else{ // Edit an existent item
			for(var i = 0, h = obj.items.length; i < h; i++){
			  if(obj.items[i].id == item_id){
				obj.items[i] = item;
				
				// Update the item text in playlist
				$('#'+item_id).find('span').text(annotation);
				break;
			  }
			}
		}	
		clear_item_form();
	}
	
	function delete_item(item_id){
		
		// Clear item form if item is selected
		if( $('#item_id').val() == item_id){
			obj.clear_item_form();
		}
		
		for(var i = 0, h = obj.items.length; i < h; i++){
			if(obj.items[i].id == item_id){
				obj.items.splice(i, 1); // Remove item from obj.items
				$('#'+item_id).remove();// Remove item from playlist
				return;
			}
		}
	}
	
	function swap(a, b){
		var ea = $('#'+a),
			eb = $('#'+b),
			tmp;
		
		tmp = ea.html();
		ea.html(eb.html());
		eb.html(tmp);
		ea.attr('id', b);
		eb.attr('id', a);
	}
	
	function move_item(item_id, disp){
	
		var l = obj.items.length,
			e, ne,
			np, p = -1,
			tmp;
	
		if(l){
			for(var i = 0; i < l; i++){
				if(obj.items[i].id == item_id){
					p = i;
					break;
				}
			}
			
			np = p+disp;
			if(np < l && np >= 0){
				tmp = obj.items[p];
				obj.items[p] = obj.items[np];
				obj.items[np] = tmp;
				
				//ordering visual components
				swap(obj.items[p].id, obj.items[np].id);
				
			} 
		}	
	}
	
	function clear_item_form(){
		$('#item_form').find('input[type="text"], input[type="hidden"]').val('');
		$('.remove_field').click();
	}
	
	function hide_item_form(){
		$('#item_form').hide();
	}
	
	function submit_item_form(){
		if(is_empty($('#cpmp_player_name').val())){
			alert('The media player\' name is required.');
			return;
		}
		if(obj.items.length){
			var f = $('#cpmp_media_player_form'),
				playlist_items_str = JSON.stringify(obj.items),
				playlist_field = $('<input type="hidden" name="cpmp_media_player_playlist" />');
			
			playlist_field.val(playlist_items_str);
			f.append(playlist_field);
			f[0].submit();
		}else{
			alert('At least a item must be entered to playlist.');
		}
	}
	
	function edit_item($pl_item){
		
		function set_value(e, value){
			if(value){
				$('#'+e).val(value);
			}
		};
		
		var item_id = $pl_item.attr('id');
		
		// Clear the item form
		obj.clear_item_form();
		$('#item_form').show();
		
		// Search the item data
		for(var i = 0, h = obj.items.length; i < h; i++){
			if(obj.items[i].id == item_id){
				var item = obj.items[i];
				
				set_value('item_id', item_id);
				set_value('item_annotation', item.annotation.replace(/&quot;/g, '"'));
				set_value('item_link', item.link);
				set_value('item_poster', item.poster);
				
				for(var j = 0, k = item.files.length; j < k; j++){
					var e = $('.item_file').last();
					if(e.val() != ""){
						e = obj.add_field(e, 'item_file').find('.item_file');
					}
					e.val(item.files[j]);
				}
				
				for(var j = 0, k = item.subtitles.length; j < k; j++){
					var subtitle 	= item.subtitles[j],
						e 			= $('.item_subtitle').last();

					if(e.val() != ""){
						e = obj.add_field(e, 'item_subtitle').find('.item_subtitle');
					}
					e.val(subtitle.link)
					e.next('.item_subtitle_lang').val(subtitle.language);
				}
			}
		}
	}
	
	
	function open_insertion_window(){
		var c = $(' <div title="'+cpmp_insert_media_player.title+'"><div style="padding:20px;"><label for="cpmp_media_player">'+
					cpmp_insert_media_player.label+'<br />'+cpmp_insert_media_player.tag+
					'</div></div>'
				);
		
		c.dialog({
			dialogClass: 'wp-dialog',
            modal: true,
            closeOnEscape: true,
            buttons: [
                {text: 'OK', click: function() {
					var p = $('#cpmp_media_player');
					if(p.length){
						var v = p.val();
						if(send_to_editor){
							send_to_editor('[codepeople-html5-media-player id='+v+']');
						}
					}
					$(this).dialog("close"); 
				}}
            ],
			close:function(){
				$(this).dialog('destroy');
				c.remove();
			}
        });
	};
	
	// Main program
	
	// Global events
    $('#items_container').bind('click', function(evt){ 
        var t = $(evt.target);
        if(t[0].tagName == 'SPAN' && t.parents('.playlist_item').length > 0) cpmp.edit_item(t.parents('.playlist_item'));
    });
    
	// CPMP object definition
	var obj = {
		items:[]
	};
	
	// Assign methods
	obj.display_item_form = display_item_form;
	obj.set_skin = set_skin;
	obj.load_additional_skins = load_additional_skins;
	obj.remove_player = remove_player;
	obj.add_field = add_field;
	obj.remove_field = remove_field;
	obj.clear_item_form = clear_item_form;
	obj.hide_item_form = hide_item_form;
	obj.submit_item_form = submit_item_form;
	obj.add_item = add_item;
	obj.delete_item = delete_item;
	obj.move_item = move_item;
	obj.edit_item = edit_item;
	obj.open_insertion_window = open_insertion_window;
	
	return obj;
}(jQuery);

jQuery(
	function($){
		
		if(typeof cpmp_playlist_items != 'undefined' && cpmp_playlist_items){
			cpmp.items = cpmp_playlist_items;
		}
		
		cpmp.load_additional_skins();
		
		$( 'select#player_id' ).on( 'change', function( evt ){ var e = $(evt.target); $( '#avp_display_shortcode' ).html( '[codepeople-html5-media-player id="'+e.val()+'"]' ); } );
		$( 'select#player_id' ).trigger( 'change' );
	}
);

function avp_select_file( e ){
	var avp_file_path_field = jQuery( e ).parent().find( 'input[type="text"]' )
	var media = wp.media(
		{
				title: 'Select Media File',
				button: {
				text: 'Select Item'
				},
				multiple: false
		}).on('select', 
			(function( field ){
				return function() {
					var attachment = media.state().get('selection').first().toJSON();
					var url = attachment.url;
					field.val( url );
				};
			})( avp_file_path_field )	
		).open();
	return false;
};