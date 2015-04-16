<?php
/*
* Plugin Name: Srvd
* Description: Srvd WordPress Plugin
* Version: 1.0.3
* Author: Srvd 
* Author URI: http://www.srvd.co/
* 
*/

/**
 * @author BS Technologies SARL <info@bstechnologies.com>
 * @version 1.0
 * @package SRVD WP Plugin
 */

/**
 * load script
 */
function form_scripts_method() {

    global $wpdb;
    
    $apiKey = $wpdb->get_var("SELECT option_value FROM wp_options WHERE option_name = 'srvd_apiKey'");
    
    wp_enqueue_script( 'form-script', plugins_url('js/script.js', __FILE__), array('jquery'));
    
    if ($apiKey){
        wp_localize_script( 'form-script', 'hasApiKey',  "true" );
    } else {
        wp_localize_script( 'form-script', 'hasApiKey',  "false" );
    }
    
    wp_enqueue_style('srvd-icon', plugins_url('css/srvd_icon.css',__FILE__ ));
    wp_localize_script( 'form-script', 'admin_url',  admin_url( 'admin-ajax.php' ) );
    wp_localize_script( 'form-script', 'plugin_url',  plugins_url('', __FILE__) );
    wp_localize_script( 'form-script', 'apiKey', $apiKey );
}

/**
 * options menu for srvd plugin
 */
function srvd_menu(){
    add_options_page( 'srvd Options', 'Srvd', 'manage_options', 'srvd-login', 'srvd_options' );
}
function srvd_options() {
    if ( !current_user_can( 'manage_options' ) )  {
        wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    }
    $content = file_get_contents("form.html", true);
    echo $content;
}

/**
 * End options menu
 */
    
/**
 * 
 * Add dropdown to tinymce
*/

function add_dropdown(){

    if ( !current_user_can('edit_posts') && !current_user_can('edit_pages') ) {
        return;
    }
    
    if ( get_user_option('rich_editing') == 'true') {
        add_filter("mce_external_plugins", "register_dropdown");
        add_filter('mce_buttons', 'add_dropDown_plugin');
    }
}

function add_dropDown_plugin($buttons) {
    array_push($buttons, "srvd_dropdown");
    return $buttons;
}

function register_dropdown($plugin_array) {
    $plugin_array['srvd_dropdown'] = plugins_url( 'js/new_dropdown.js', __FILE__ );
    return $plugin_array;
    
}

/**
 * ajax callback function
 */

function setEmail() {
    global $wpdb;
    
    $apiKey = $_POST['apiKey'];
    
    $wpdb->replace(
        'wp_options',
        array(
            'option_name' => 'srvd_apiKey',
            'option_value' => $apiKey,
            
        )    
    );
    wp_die();
}

/**
 * Script added on header (all pages)
 */
function script_on_all_page(){
    global $wpdb;
    
    $apiKey = $wpdb->get_var("SELECT option_value FROM wp_options WHERE option_name = 'srvd_apiKey'");
    if($apiKey){
        wp_enqueue_script( 'head-script', "//app.srvd.co/placement/output/".$apiKey."/javascript.js", array('jquery'));
    }
    
}

/**
 * actions
 */

add_action('wp_enqueue_scripts', 'script_on_all_page');
add_action( 'admin_enqueue_scripts', 'form_scripts_method' );
add_action( 'wp_ajax_setEmail', 'setEmail' );
add_action('admin_head', 'add_dropdown');
add_action( 'admin_menu', 'srvd_menu' );