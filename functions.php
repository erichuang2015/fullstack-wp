<?php 

  require get_theme_file_path('/inc/search-route.php');

  function codeschool_custom_rest() {
    register_rest_field('post', 'authorName', array(
      'get_callback' => function() { return get_the_author(); }
    ));

    register_rest_field('note', 'noteCount', array(
      'get_callback' => function() { return count_user_posts(get_current_user_id(), 'note'); }
    ));
  }

  add_action('rest_api_init', 'codeschool_custom_rest');

  function pageBanner($args = NULL) { 
      if (!$args['title']) {
        $args['title'] = get_the_title();
      }

      if (!$args['subtitle']) {
        $args['subtitle'] = get_field('page_banner_subtitle');
      }

      if (!$args['photo']) {
        if (get_field('page_banner_background_image')) {
          $args['photo'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
        } else {
          $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
        }
      }
    ?>
    <div class="page-banner">
      <div class="page-banner__bg-image" style="background-image: url(<?php echo $args['photo']; ?>);"></div>
      <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?php echo $args['title']; ?></h1>
        <div class="page-banner__intro">
          <p><?php echo $args['subtitle']; ?></p>
        </div>
      </div>  
    </div>
  <?php }

  function codeschool_files() {
    wp_enqueue_script('googleMap', '//maps.googleapis.com/maps/api/js?key=AIzaSyAKxBQhfXUivg62ONdBPbw0ZDYtYvSeX3w', NULL, '1.0', true);
    wp_enqueue_script('main_codeschool_js', get_theme_file_uri('/js/scripts-bundled.js'), NULL, '1.0', true);
    wp_enqueue_script('codeschool_search', get_theme_file_uri('/js/modules/Search.js'), array('jquery'), '1.0', true);
    wp_enqueue_script('codeschool_notes', get_theme_file_uri('/js/modules/MyNotes.js'), array('jquery'), '1.0', true);
    wp_enqueue_script('codeschool_likes', get_theme_file_uri('/js/modules/Like.js'), array('jquery'), '1.0', true);
    wp_enqueue_style('google_fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('font_awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('codeschool_global_styles', get_stylesheet_uri());
    wp_localize_script('codeschool_search', 'codeschoolData', array(
      'root_url' => get_site_url(),
      'nonce' => wp_create_nonce('wp_rest')
    ));
  }

  add_action('wp_enqueue_scripts', 'codeschool_files');

  function codeschool_features() {
    register_nav_menu('mainNavigation', 'Main Navigation');
    register_nav_menu('footerLocationOne', 'Footer Location One');
    register_nav_menu('footerLocationTwo', 'Footer Location Two');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_image_size('professorLandscape', 400, 260, array('center', 'top'));
    add_image_size('professorPortrait', 480, 650, true);
    add_image_size('pageBanner', 1500, 350, true);
  }

  add_action('after_setup_theme', 'codeschool_features');

  function codeschool_adjust_queries($query) {
    if (!is_admin() AND is_post_type_archive('campus') AND $query->is_main_query()) {
      $query->set('posts_per_page', -1);
    }
    
    if (!is_admin() AND is_post_type_archive('program') AND $query->is_main_query()) {
      $query->set('orderby', 'title');
      $query->set('order', 'ASC');
      $query->set('posts_per_page', -1);
    }

    if (!is_admin() AND is_post_type_archive('event') AND $query->is_main_query()) {
      $today = date('Ymd');
      $query->set('meta_key', 'event_date');
      $query->set('orderby', 'meta_value_num');
      $query->set('order', 'ASC');
      $query->set('meta_query', array(
        array(
          'key' => 'event_date',
          'compare' => '>=',
          'value' => $today,
          'type' => 'numeric'
        )
      ));
    }
  }

  add_action('pre_get_posts', 'codeschool_adjust_queries');

  function codeschool_map_key($api) {
    $api['key'] = 'AIzaSyAKxBQhfXUivg62ONdBPbw0ZDYtYvSeX3w';
    return $api;
  }

  add_filter('acf/fields/google_map/api', 'codeschool_map_key');

  add_action('admin_init', 'redirect_subs_to_frontend');

  function redirect_subs_to_frontend() {
    $currentUser = wp_get_current_user();
    
    if (count($currentUser->roles) == 1 AND $currentUser->roles[0] == 'subscriber') {
      wp_redirect(site_url('/'));
      exit;
    }
  }

  add_action('wp_loaded', 'no_subs_admin_bar');

  function no_subs_admin_bar() {
    $currentUser = wp_get_current_user();
    
    if (count($currentUser->roles) == 1 AND $currentUser->roles[0] == 'subscriber') {
      show_admin_bar(false);
    }
  }

  add_filter('login_headerurl', 'out_header_url');

  function our_header_url() {
    return esc_url(siteurl('/'));
  }

  add_action('login_enqueue_scripts', 'our_login_css');

  function our_login_css() {
    wp_enqueue_style('codeschool_global_styles', get_stylesheet_uri());
    wp_enqueue_style('google_fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  }

  add_filter('login_headertitle', 'our_login_title');

  function our_login_title() {
    return get_bloginfo('name');
  }

  add_filter('wp_insert_post_data', 'make_note_private', 10, 2);

  function make_note_private($data, $postarr) {
    if ($data['post_type'] == 'note') {
      
      if (count_user_posts(get_current_user_id(), 'note') > 99 AND !$postarr['ID']) {
        die("You have reached your note limit");
      }

      $data['post_title'] = sanitize_text_field($data['post_title']);
      $data['post_content'] = sanitize_textarea_field($data['post_content']);
    }
    
    if ($data['post_type'] == 'note' AND $data['post-status'] != 'trash') {
      $data['post_status'] = "private";
    }
    
    return $data;
  }
?>
