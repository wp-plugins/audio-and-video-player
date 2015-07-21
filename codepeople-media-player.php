<?php
/*
Plugin Name: CP Media Player - Audio Player and Video Player
Plugin URI: http://www.tsplayer.com/audio-and-video-player
Description: CP Media Player - Audio Player and Video Player allows you to post multimedia files on your website or blog in a simple way while providing compatibility with all major browsers such as IE, Firefox, Opera, Safari, Chrome and mobile devices: iPhone, iPad, Android.
Author: CodePeople
Version: 1.0.2
Author URI: http://www.tsplayer.com
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

/*
Adapted from: http://mediaelementjs.com/ plugin
*/


define('CPMP_PLUGIN_DIR', WP_PLUGIN_DIR."/".dirname(plugin_basename(__FILE__)));
define('CPMP_PLUGIN_URL', WP_PLUGIN_URL."/".dirname(plugin_basename(__FILE__)));

require 'codepeople-media-player.clss.php';

// Create a global object 
$cpmp_obj = new CodePeopleMediaPlayer();

register_activation_hook(__FILE__, array(&$cpmp_obj, 'register_plugin'));
// A new blog has been created in a multisite WordPress
add_action( 'wpmu_new_blog', array(&$cpmp_obj, 'installing_new_blog'), 10, 6);

$plugin = plugin_basename(__FILE__);
//add_filter('plugin_action_links_'.$plugin, array(&$cpmp_obj, 'customization_link'));
add_filter('plugin_action_links_'.$plugin, 'cpmp_settings_link');

if(!function_exists('cpmp_settings_link')){
	/*
		Set a link to plugin settings
	*/
	function cpmp_settings_link($links) { 
		$settings_link = '<a href="options-general.php?page=codepeople-media-player.php">'.__('Settings').'</a>'; 
		array_unshift($links, $settings_link); 
		return $links; 
	} // End settingsLink
}

//Initialize the admin panel 
add_action('admin_menu', 'cpmp_admin_menu');
if (!function_exists("cpmp_admin_menu")) { 
	function cpmp_admin_menu() { 
		global $cpmp_obj; 
		// Add to admin_menu
		add_options_page('Audio And Video Player', 'Audio And Video Player', 'edit_posts', basename(__FILE__), array(&$cpmp_obj, 'admin_page')); 
	}    
}

//Initialize the admin section
add_action('media_buttons', array(&$cpmp_obj, 'insert_player_button'), 100);

// Load scripts only for post/page edition
add_action( 'admin_enqueue_scripts', 'cpmp_admin_scripts', 10, 1 );
function cpmp_admin_scripts( $hook ) {
    global $post, $cpmp_obj;

    if ( $hook == 'post-new.php' || $hook == 'post.php' ) {
		$cpmp_obj->set_load_media_player_window();
    }
}

add_action( 'init', 'cpmp_init');
if(!function_exists('cpmp_init')){
	function cpmp_init(){
		global $cpmp_obj;
		add_shortcode('codepeople-html5-media-player', array(&$cpmp_obj, 'replace_shortcode'));
	}
}
?>
