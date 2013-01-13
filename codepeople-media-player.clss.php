<?php

// Defining constants
define ('CPMP_PLAYER', 'cpmp_player');

class CodePeopleMediaPlayer {

	/* 
		Register plugin
		Create database structure
	*/
	function register_plugin($networkwide){
		global $wpdb;
		
		if (function_exists('is_multisite') && is_multisite()) {
			if ($networkwide) {
	            $old_blog = $wpdb->blogid;
				// Get all blog ids
				$blogids = $wpdb->get_col($wpdb->prepare("SELECT blog_id FROM $wpdb->blogs"));
				foreach ($blogids as $blog_id) {
					switch_to_blog($blog_id);
					$this->_create_db_structure();
				}
				switch_to_blog($old_blog);
				return;
			}
		}
		$this->_create_db_structure();
		
	}
	
	/*
		Create the database structure for save player's data
	*/
	function _create_db_structure(){
		global $wpdb;

		$sql = "CREATE TABLE IF NOT EXISTS ".$wpdb->prefix.CPMP_PLAYER." (
			id mediumint(9) NOT NULL AUTO_INCREMENT,
			player_name VARCHAR(250) NOT NULL DEFAULT '',
			config LONGTEXT NULL,
			playlist LONGTEXT NULL,
			UNIQUE KEY id (id)
         );";             
		$wpdb->query($sql); 
	}
	
	function _get_skin_list(&$selected_skin, $type, &$width, &$height){
		$skin_dir = CPMP_PLUGIN_DIR.'/skins';
		$skins_arr = array();
		$skins_list = '';
		$skins_list_script = 'var cpmp_skin_list = [];';
		$c = 0;
		if(file_exists($skin_dir)){
			$d = dir($skin_dir);
			while (false !== ($entry = $d->read())) {
				if($entry != '.' && $entry != '..' && is_dir($skin_dir.'/'.$entry)){
					$this_skin = $skin_dir.'/'.$entry.'/';
					if(file_exists($this_skin)){
						$skin_data = parse_ini_file($this_skin.'config.ini', true);
						if(isset($skin_data['id'])){ 
							if(empty($selected_skin)){
								$selected_skin = $skin_data['id'];
							}	
								
							$skins_list .= '
									<img 
										src="'.((isset($skin_data['thumbnail'])) ? CPMP_PLUGIN_URL.'/skins/'.$entry.'/'.$skin_data['thumbnail'] : CPMP_PLUGIN_URL.'/images/thumbnail.jpg').'" 
										title="'.((isset($skin_data['name'])) ?  $skin_data['name'] : $skin_data['id']).'"
										onclick="cpmp.set_skin(this, \''.$skin_data['id'].'\', \''.((isset($skin_data[$type]["width"])) ? $skin_data[$type]["width"] : '').'\', \''.((isset($skin_data[$type]["height"])) ? $skin_data[$type]["height"] : '').'\');"';
							$skins_list_script .= 'cpmp_skin_list['.$c.']="'.$skin_data['id'].'";';
							$c++;
							
							if($selected_skin == $skin_data['id']){
								$skins_list .= ' class="'.skin_selected.'" style="border: 1px dotted #CCC;margin-left:5px;cursor:pointer;" ';
								$width  = ((isset($skin_data[$type]["width"])) ? $skin_data[$type]["width"] : '');
								$height = ((isset($skin_data[$type]["height"])) ? $skin_data[$type]["height"] : '');
							}else	
								$skins_list .= ' style="margin-left:5px;cursor:pointer;" ';
								
							$skins_list .= '/><script>'.$skins_list_script.'</script>';
						}	
					}
				}	
			}
			$d->close();
		}

		return $skins_list;	
	}
	
	function check_upload_media_context($context) {
		if (isset($_REQUEST['context']) && $_REQUEST['context'] == $context) {
			return TRUE;
		} elseif (isset($_POST['attachments']) && is_array($_POST['attachments'])) { 
			// check for context in attachment objects 
			$media_data = current($_POST['attachments']);
			if (isset($media_data['context']) && $media_data['context'] == $context ) {
				return TRUE;
			}
		} 
		return FALSE;
	}
	
	function _media_action_button($form_fields, $post){
		$hidden = "<input type='hidden' name='attachments[$post->ID][url]' value='" . esc_attr($post->guid) . "' />";
		$send   = "<input type='submit' class='button' name='send[$post->ID]' value='" . __( 'Set in item' ) . "' />";
		$form_fields = array(
			'buttons' 		=> array('tr' => "\t\t<tr class='submit'><td></td><td class='savesend'>$hidden $send</td></tr>\n"),
			'context' 		=> array( 'input' => 'hidden', 'value' => $_REQUEST['context'] ),
			'input_field' 	=> array( 'input' => 'hidden', 'value' => $_REQUEST['container_id'] )
		);	
		return $form_fields;
	}
	
	function _media_selected($html, $send_id, $attachment) {
		$href = $attachment['url'];
		?>
		<script type="text/javascript">
		/* <![CDATA[ */
	
		var win = window.dialogArguments || opener || parent || top;
		win.jQuery( '#<?php echo $attachment['input_field']; ?>' ).val('<?php echo addslashes($href); ?>');
		win.tb_remove();
		/* ]]> */
		</script>
		<?php
		exit();
	}
	
	function _let_library_only($_default_tabs){
		unset($_default_tabs['type']);
		unset($_default_tabs['type_url']);
		unset($_default_tabs['gallery']);
		return($_default_tabs); 
	}
	
	/*
		Create the settings page
	*/
	function admin_page(){
		global $wpdb;
?>
		<h2><?php _e('Audio And Video Player'); ?></h2>
		<p  style="border:1px solid #E6DB55;margin-bottom:10px;padding:5px;background-color: #FFFFE0;"><?php _e('For any issues with the media player, go to our <a href="http://www.tsplayer.com/contact-us" target="_blank">contact page</a> and leave us a message.'); ?></p>
		
<?php	
		if(wp_verify_nonce($_POST['cpmp_player_create_update_nonce'], __FILE__)){
			// Save player's data
			// Constructs the configuration stdClass
			$conf = new stdClass;

			if(!empty($_POST['cpmp_width'])) $conf->width = $_POST['cpmp_width'];
			if(!empty($_POST['cpmp_height'])) $conf->height = $_POST['cpmp_height'];
			if(!empty($_POST['cpmp_type'])) $conf->type = $_POST['cpmp_type'];
			if(!empty($_POST['cpmp_skin'])) $conf->skin = $_POST['cpmp_skin'];
			if(isset($_POST['cpmp_autoplay'])) $conf->autoplay = 'autoplay';
			if(isset($_POST['cpmp_show_playlist'])) $conf->playlist = true;
			if(isset($_POST['cpmp_loop'])) $conf->loop = 'loop';
			$conf->preload = (isset($_POST['cpmp_preload'])) ? 'auto' : 'none';
			$playlist = json_decode(stripslashes($_POST['cpmp_media_player_playlist']));
			$data = array(
							'player_name' => $_POST['cpmp_player_name'],
							'config' => serialize($conf),
							'playlist' => serialize($playlist)
						);
						
			if(empty($_POST['cpmp_player_id'])){
				$wpdb->insert(
								$wpdb->prefix.CPMP_PLAYER,
								$data,
								array( '%s', '%s', '%s' )
							);
			}	
			else{
				$wpdb->update(
								$wpdb->prefix.CPMP_PLAYER,
								$data,
								array('id' => $_POST['cpmp_player_id']),
								array( '%s', '%s', '%s' ),
								array('%d')
							);
			}	
		}
		
		if ((!wp_verify_nonce($_POST['cpmp_player_edition_nonce'],__FILE__) && !wp_verify_nonce($_POST['cpmp_player_creation_nonce'],__FILE__)) || (wp_verify_nonce($_POST['cpmp_player_edition_nonce'],__FILE__) && isset($_POST['cpmp_action']) && $_POST['cpmp_action'] == 'remove')){
		
			$wpdb->query( 
				$wpdb->prepare( 
					"
					 DELETE FROM ".$wpdb->prefix.CPMP_PLAYER."
					 WHERE id = %d
					",
						$_POST['player_id'] 
					)
			);
			
			$sql = "SELECT id, player_name FROM ".$wpdb->prefix.CPMP_PLAYER.";";
			$players = $wpdb->get_results($sql);
			
			if(count($players)){
				wp_enqueue_script('cpmp-admin', plugin_dir_url(__FILE__).'js/cpmp_admin.js', array('jquery'));
?>		
				<div class="wrap">
			
					<form method="post" action="<?php $_SERVER['REQUEST_URI']; ?>">
					<?php
						// create a custom nonce for submit verification later
						echo '<input type="hidden" name="cpmp_player_edition_nonce" value="' . wp_create_nonce(__FILE__) . '" />';
					?>
						<input type="hidden" name="cpmp_action" id="cpmp_action" value="update">
						<div style="border: 1px solid #CCC;padding:10px;">
							<h3>Edit an existent player</h3>
							<select id="player_id" name="player_id">
							<?php
								foreach($players as $player){
									print '<option value="'.$player->id.'">'.stripslashes($player->player_name).'</option>';
								}
							?>
							</select>
							<input type="submit" value="Edit media player" class="button-primary">
							<input type="button" value="Remove media player" class="button-primary" onclick="cpmp.remove_player();">
						</div>
						<div>
							<?php _e('Only one media player can be inserted in the free version of Audio and Video Player. To increase the media player features, get the professional version on <a href="http://www.tsplayer.com/audio-and-video-player" target="_blank">Audio and Video Player</a>.'); ?>
						</div>
					</form>	
			
<?php
			} // End player edition	
			else{	
?>						
					<form method="post" action="<?php echo $_SERVER['REQUEST_URI']; ?>">	
						<?php
							// create a custom nonce for submit verification later
							echo '<input type="hidden" name="cpmp_player_creation_nonce" value="' . wp_create_nonce(__FILE__) . '" />';
						?>
						<div style="border: 1px solid #CCC;padding:10px;">
							<h3>Create new one</h3>
							<input type="radio" name="player_type" value="audio" checked> Audio <input type="radio" name="player_type" value="video"> Video <input type="submit" value="Create new media player" class="button-primary" />
						</div>
						<div>
							<?php _e('Only one media player can be inserted in the free version of Audio and Video Player. To increase the media player features, get the professional version on <a href="http://www.tsplayer.com/audio-and-video-player" target="_blank">Audio and Video Player</a>.'); ?>
						</div>
					</form>
			</div>
<?php		
			} // End create new player
		}else{
			if(!isset($_POST['player_id'])){
						$sql = "SELECT count(*) FROM ".$wpdb->prefix.CPMP_PLAYER.";";
						$c = $wpdb->get_var($sql);
						if($c > 0)
							header('location:options-general.php?page=codepeople-media-player.php');
					}
			wp_enqueue_style('thickbox');
			wp_enqueue_script('cpmp-admin', plugin_dir_url(__FILE__).'js/cpmp_admin.js', array('jquery', 'thickbox'));
			
			$image_library_url = get_upload_iframe_src( 'image', null, 'library' );
			$image_library_url = remove_query_arg( array('TB_iframe'), $image_library_url );
			$image_library_url = add_query_arg( array( 'tab'=>'library', 'post_mime_type'=>'image', 'container_id' => 'item_poster', 'context' => 'cpmp-poster-image', 'TB_iframe' => 1), $image_library_url );
			
			$player = new stdClass;
			$config = new stdClass;
			$config->skin = '';
			$playlist = new stdClass;
			$insertion_button_text = __('Create Media Player');
			
			if(wp_verify_nonce($_POST['cpmp_player_edition_nonce'],__FILE__) && isset($_POST['player_id'])){ // Edition 
				$player_id = $_POST['player_id'];
				$player 	= $wpdb->get_row('SELECT * FROM '.$wpdb->prefix.CPMP_PLAYER.' WHERE id='.$player_id);
				$config 	= unserialize($player->config);
				$playlist 	= unserialize($player->playlist);
				
				// Create the playlist data
				$playlist_json = json_encode($playlist);
				echo "<script>
						var cpmp_playlist_items = {$playlist_json};
					  </script>";
				
				$playlist_item_list = '';	

				if($playlist){
					foreach($playlist as $item){
						$playlist_item_list .= '<div id="'.$item->id.'" class="playlist_item" style="cursor:pointer;"><input type="button" value="Delete item" onclick="cpmp.delete_item(\''.$item->id.'\');"><span>'.$item->annotation.'</span></div>';
					}
				}
				$insertion_button_text = __('Update Media Player');
				
			}
			
			if(wp_verify_nonce($_POST['cpmp_player_creation_nonce'], __FILE__)){
				$config->type = $_POST['player_type'];
			}
			
			$media_library_url = get_upload_iframe_src( 'media', null, 'library' );
			$media_library_url = remove_query_arg( array('TB_iframe'), $media_library_url );
			$media_library_url = add_query_arg( array( 'tab'=>'library', 'post_mime_type'=>$config->type, 'container_id' => 'item_file', 'context' => 'cpmp-media-files', 'TB_iframe' => 1 ), $media_library_url );
			
			$width_limit  = '';
			$height_limit = '';
			$skin_list = $this->_get_skin_list($config->skin, $config->type, $width_limit, $height_limit);
	?>
			<div class="wrap">
				<form id="cpmp_media_player_form" method="post" action="<?php echo $_SERVER['REQUEST_URI']; ?>">
					<input type="hidden" value="<?php echo ((isset($config->skin)) ? $config->skin : ''); ?>" name="cpmp_skin" />
					<?php
						if(isset($player_id)) echo '<input type="hidden" value="'.$player_id.'" name="cpmp_player_id" />';
						if(isset($config->type)) echo '<input type="hidden" value="'.$config->type.'" name="cpmp_type" />';
						
					?>
					<div class="updated" style="padding:5px;">
						<?php _e('For more information go to the <a href="http://www.tsplayer.com/audio-and-video-player" target="_blank">Audio And Video Player</a> plugin page'); 
						?>
					</div>
					<h3><?php _e('Select the media player skin'); ?></h3>
					
					<div id="skin_container" style="overflow-x:auto;height:127px;width:100%;">
					<?php	
						print $skin_list;
					?>
					</div>	
					<h3><?php _e('Configure media player'); ?></h3>
					<table class="form-table">
						<tbody>
							<tr valign="top">
								<th scope="row" nowrap>
									<label for="cpmp_player_name"><?php _e('Player name'); ?> <span style="color:red">*</span> :</label>
								</th>
								<td style="width:100%">
									<input type="text" id="cpmp_player_name" name="cpmp_player_name" value="<?php echo esc_attr((isset($player->player_name)) ? stripslashes($player->player_name) : "" ); ?>" />
								</td>
							</tr>
							
							<tr valign="top">
								<th scope="row">
									<label for="cpmp_width"><?php _e('Width:'); ?></label>
								</th>
								<td style="width:100%">
									<input type="text" id="cpmp_width" name="cpmp_width" value="<?php echo esc_attr((isset($config->width)) ? $config->width : "" ); ?>" /><div id="cpmp_width_info" style="font-style:italic; color:#666;"><?php _e('Value should be greater than or equal to:'.$width_limit); ?></div>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row">
									<label for="cpmp_height"><?php _e('Height:'); ?></label>
								</th>
								<td style="width:100%">
									<input type="text" id="cpmp_height" name="cpmp_height" value="<?php echo esc_attr((isset($config->height)) ? $config->height : "" ); ?>" /><div id="cpmp_height_info" style="font-style:italic; color:#666;"><?php _e('Value should be greater than or equal to:'.$height_limit); ?></div>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row">
									<label for="cpmp_autoplay"><?php _e('Autoplay:'); ?></label>
								</th>
								<td style="width:100%">
									<input type="checkbox" id="cpmp_autoplay" name="cpmp_autoplay" <?php echo ((isset($config->autoplay)) ? "checked" : "" ); ?> /> <span style="font-style:italic; color:#666;"><?php _e("Some devices don't allow autoplay"); ?></span>
								</td>
							</tr>
							<tr valign="top">
								<th scope="row">
									<label for="cpmp_loop"><?php _e('Loop:'); ?></label>
								</th>
								<td style="width:100%">
									<input type="checkbox" id="cpmp_loop" name="cpmp_loop" <?php echo ((isset($config->loop)) ? "checked" : "" ); ?> />
								</td>
							</tr>
							<tr valign="top">
								<th scope="row">
									<label for="cpmp_preload"><?php _e('Preload:'); ?></label>
								</th>
								<td style="width:100%">
									<input type="checkbox" id="cpmp_preload" name="cpmp_preload" <?php echo ((isset($config->preload) && $config->preload != 'none') ? "checked" : "" ); ?> />
								</td>
							</tr>
							<tr valign="top">
								<th scope="row">
									<label for="cpmp_preload"><?php _e('Show playlist:'); ?></label>
								</th>
								<td style="width:100%">
									<input type="checkbox" id="cpmp_show_playlist" name="cpmp_show_playlist" <?php echo ((isset($config->playlist)) ? "checked" : "" ); ?> />
								</td>
							</tr>
						</tbody>
					</table>
					<h3><?php _e('Create playlist'); ?></h3>
					<table class="form-table">
						<tbody>
							<tr valign="top">
								<td>
									<input type="button" id="insert" name="insert" value="Create New Item" class="button-primary" onclick="cpmp.display_item_form();" />
								</td>
							</tr>
							<tr>
								<td>
									<div id="item_form" style="display:none; border:1px dotted #CCC;padding:10px;">
										<h3><?php _e('Enter item\'s data'); ?></h3>
										<input type="hidden" name="item_id" id="item_id" value="" />
										<table>
											<tbody>
												<tr>
													<th>
														<label for="item_annotation"><?php _e('Title'); ?> <span style="color:red;">*</span> :</label>
													</th>
													<td style="width:100%;">
														<input type="text" name="item_annotation" id="item_annotation" />
													</td>
												</tr>	
												<tr>
													<th nowrap>
														<label for="item_link"><?php _e('Associated link:'); ?></label>
													</th>
													<td>
														<input type="text" name="item_link" id="item_link" />
													</td>
												</tr>
												<?php if(isset($config->type) && $config->type == 'video'){?>
												<tr>
													<th>
														<label for="item_poster"><?php _e('Poster:'); ?></label>
													</th>
													<td>
														<input type="text" name="item_poster" id="item_poster" class="item_poster" />
														<a title="<?php _e('Select the item poster'); ?>" href="<?php echo esc_url( $image_library_url ); ?>" class="thickbox"><?php _e('Select Poster'); ?></a>
														<br />
														<span style="font-style:italic; color:#666;">
														<?php 
															_e('Select a poster image from Media Library or enter the URL to the poster file directly on field. If the Media Library is empty, go to the <a href="media-new.php">Media Library</a> and upload the files.');
														?>	
														</span>
													</td>
												</tr>
												<?php } ?>
												<tr>
													<th nowrap>
														<label><?php _e('Songs/Videos'); ?> <span style="color:red;">*</span> :</label>
													</th>
													<td>
														<div>
															<input type="text" name="item_file[]" class="item_file" id="item_file" value="" >
															<a title="<?php _e('Select the item file'); ?>" href="<?php echo esc_url( $media_library_url ); ?>" class="thickbox"><?php _e('Select File'); ?></a>
															<input type="button" value="Add another one" onclick="cpmp.add_field(this, 'item_file')">
														</div>	
														<br />
														<span style="font-style:italic; color:#666;">
														<?php 
															_e('Select a Song/Video from Media Library or enter the URL to the Song/Video file directly on field. If the Media Library is empty, go to the <a href="media-new.php">Media Library</a> and upload the files.');
														?>	
														</span>
													</td>
												</tr>
												<tr>
													<th>
														<label><?php _e('Subtitles:'); ?></label>
													</th>
													<td>
														<div>
															<input type="text" name="item_subtitle[]" class="item_subtitle" value="" />
															<?php _e('Lang: '); ?>
															<input type="text" name="item_subtitle_lang[]" class="item_subtitle_lang" value="" />
															<input type="button" value="Add another one" onclick="cpmp.add_field(this, 'item_subtitle')">
														</div>	
														<br />
														<span style="font-style:italic; color:#666;">
														<?php 
															_e('Set the URL to the subtitle file directly on field. If the language field is omitted, the language is inferred from subtitle location\'s field');
														?>	
														</span>
													</td>
												</tr>
												<tr>
													<td></td>
													<td>
														<input type="button" name="insert_item" value="<?php _e('Insert / Update item on playlist'); ?>" class="button-primary" onclick="cpmp.add_item();"> 
														<input type="button" name="clear_item_form" value="<?php _e('Cancel'); ?>" class="button-primary" onclick="cpmp.clear_item_form();cpmp.hide_item_form();">
													</td>	
												</tr>
											</tbody>
										</table>
									</div>
								</td>	
							</tr>
							<tr valign="top">
								<td>
									<div id="items_container" style="border:1px solid #CCC; width:100%; height:200px; overflow:scroll;">
									<?php
										if(isset($playlist_item_list)) echo $playlist_item_list;
									?>
									</div>
								</td>
							</tr>
							<tr valign="top">
								<td>
									<input type="button" id="create" name="create" value="<?php echo $insertion_button_text; ?>" class="button-primary" onclick="cpmp.submit_item_form();" />
									<a type="button" class="button-primary" href="<?php echo $_SERVER['REQUEST_URI']; ?>">Cancel</a>
								</td>
							</tr>
						</tbody>
					</table>
					<?php
						// create a custom nonce for submit verification later
						echo '<input type="hidden" name="cpmp_player_create_update_nonce" value="' . wp_create_nonce(__FILE__) . '" />';
					?>
				</form>	
	<?php		
		}
	} // End admin_page	
	
	// Button in the post edition for media player insertion
	function insert_player_button(){
		print '<a href="javascript:cpmp.open_insertion_window();" title="'.__('Insert Media Player').'"><img src="'.CPMP_PLUGIN_URL.'/images/cpmp.gif'.'" alt="'.__('Insert Media Player').'" /></a>';
	}// End insert_player_button
	
	// Load the player button scripts and initialize the insertion dialog
	function set_load_media_player_window(){
		global $wpdb;
		
		wp_enqueue_style('wp-jquery-ui-dialog');
		wp_enqueue_script(
			'cpmp-admin',
			CPMP_PLUGIN_URL.'/js/cpmp_admin.js',
			array('jquery', 'jquery-ui-dialog')
		);
		
		// Load players
		$sql = "SELECT id, player_name FROM ".$wpdb->prefix.CPMP_PLAYER.";";
		$player = $wpdb->get_row($sql);
		
		$options = '';
		$label   = '';	
		if(count($player)){
			$tag = '<input id="cpmp_media_player" type="radio" value="'.$player->id.'" checked />'.stripslashes($player->player_name);
			$label = __('Select the player to insert:');
		}else{
			$tag = 'You must to define a media player before use it on page/post. <a href="options-general.php?page=codepeople-media-player.php">Create a media player here</a>';
		}
		
		wp_localize_script('cpmp-admin', 'cpmp_insert_media_player', array(
			'title' => __('Insert media player on your post/page'),
			'label' => $label,
			'tag'  	=> $tag
		));
	}// End set_load_media_player_window
	
	function replace_shortcode($atts){
		global $wpdb;
		
		$supported_ext = array(
							'audio' => array('mp3', 'oga', 'ogg'),
							'video' => array('wmv', 'flv', 'ogg', 'ogv', 'webm', 'm4v', 'mp4'),
						 );
		
		extract($atts);
		if(isset($id)){
			$sql = 'SELECT * FROM '.$wpdb->prefix.CPMP_PLAYER.' WHERE id='.$id;
			$player = $wpdb->get_row($sql);

			if($player != null){
				$config_obj = (isset($player->config)) ? unserialize($player->config) : new stdClass;
				$playlist_arr = (isset($player->playlist)) ? unserialize($player->playlist) : array();

				$mp_atts = array();
				$srcs = array();
				$pl_items = array();
				$mp_subtitles = array();
				$flash_src = '';
				
				// Set attributes
				if($config_obj->width) $mp_atts[] = 'width="'.$config_obj->width.'"';
				if($config_obj->height) $mp_atts[] = 'height="'.$config_obj->height.'"';
				$mp_atts[] = 'class="codepeople-media'.(($config_obj->skin) ? ' '.$config_obj->skin : '').'"';
				if($config_obj->loop) $mp_atts[] = 'loop="'.$config_obj->loop.'"';
				if($config_obj->autoplay) $mp_atts[] = 'autoplay="'.$config_obj->autoplay.'"';
				if($config_obj->preload) $mp_atts[] = 'preload="'.$config_obj->preload.'"';
				
				$first_file = true;
				$first_item = true;
				// Set sources and playlist
				foreach($playlist_arr as $i => $item){
					$item_srcs = array();
					$item_subtitles = array();
					
					// Get media files for item
					foreach( $item->files as $file){
						$file = htmlspecialchars($file);
						$ext = strtolower(substr($file, strlen($file)-4));
						if($ext[0] == '.') $ext = substr($ext, 1);
						
						switch ($ext){
							case 'mp4':
							case 'm4v':
								$ext = 'mp4';
							break;	
							case 'webm':
							case 'webma':
							case 'webmv':	
								$ext = 'webm';
							break;	
							case 'ogg':
							case 'oga':
							case 'ogv':	
								$ext = 'ogg';
							break;	
							default:
								$ext = $ext;
						}
						
						if($first_file){
							$mp_atts[] = 'src="'.$file.'"';
							$mp_atts[] = 'type="'.$config_obj->type.'/'.$ext.'"';
							$first_file = false;
						}elseif($first_item){
							$srcs[] = '<source src="'.$file.'" type="'.$config_obj->type.'/'.$ext.'" />';
						}
						
						$item_srcs[] = '{"src":"'.$file.'","type":"'.$config_obj->type.'/'.$ext.'"}';
						
						$flag = false;
					}
					
					foreach( $item->subtitles as $subtitle){
						$location = htmlspecialchars($subtitle->link);
						$language = $subtitle->language;
						$mp_subtitles[] = '<track src="'.$location.'" kind="subtitles" srclang="'.$language.'"></track>';
						$item_subtitles[] = '{"kind" : "subtitles", "src" : "'.$location.'", "srclang" : "'.$language.'"}';
					}
					
					$pl_items[] = '<li value=\'{'.
						((isset($item->poster)) ? '"poster":"'.htmlspecialchars($item->poster).'",' : '').
						'"source":['.implode(',', $item_srcs).'],'.
						'"track":['.implode(',', $item_subtitles).']'.
						'}\'>'.((!empty($item->link)) ? '<a class="cpmp-info" href="'.$item->link.'">+</a>' : '&nbsp;&nbsp;').'&nbsp;&nbsp;'.$item->annotation.'</li>';
					
					
					$first_item = false;
				}	
				$id = 'codepeople_media_player'.time();

				wp_enqueue_style(
				'html5_media_player_style',
				plugin_dir_url(__FILE__).'css/mediaelementplayer.min.css'
				);
				
				if(isset($config_obj->skin)){
					wp_enqueue_style(
					'codepeople_media_player_style_'.$config_obj->skin,
					plugin_dir_url(__FILE__).'skins/'.$config_obj->skin.'/'.$config_obj->skin.'.css'
					);
				}
				
				wp_enqueue_script( 
				'html5_media_player_script',
				plugin_dir_url(__FILE__).'js/mediaelement-and-player.min.js',
				array('jquery'),
				false,
				true
				);
				
				wp_enqueue_script( 
				'codepeople_media_player_script',
				plugin_dir_url(__FILE__).'js/codepeople-plugins.js',
				array('jquery'),
				false,
				true
				);
				
				return '<'.$config_obj->type.' id="'.$id.'" '.implode(' ', $mp_atts).'>'.implode('',$srcs).implode('', $mp_subtitles).'</'.$config_obj->type.'>'.((count($pl_items) > 0 && $config_obj->playlist) ? '<ul id="'.$id.'-list">'.implode(' ', $pl_items).'</ul>' : '').'<noscript>
				audio-and-video-player require JavaScript
			</noscript>';
				
			}else{
				return '';
			}	
			
		}else{
			return '';
		}
	} // End replace_shortcode
}

?>
