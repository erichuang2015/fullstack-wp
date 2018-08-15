<?php 
  add_action('rest_api_init', 'codeschool_register_search');

  function codeschool_register_search() {
    register_rest_route('codeschool', 'search', array(
      'methods' => WP_REST_SERVER::READABLE,
      'callback' => 'codeschool_search_results'
    ));
  }

  function codeschool_search_results() {
    return 'Congrats!';
  }

?>