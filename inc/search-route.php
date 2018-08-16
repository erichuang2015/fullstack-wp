<?php 
  add_action('rest_api_init', 'codeschool_register_search');

  function codeschool_register_search() {
    register_rest_route('codeschool/v1', 'search', array(
      'methods' => WP_REST_SERVER::READABLE,
      'callback' => 'codeschool_search_results'
    ));
  }

  function codeschool_search_results($data) {
    $professors = new WP_Query(array(
      'post_type' => 'professor',
      's' => sanitize_text_field($data['term'])
    ));

    $professorResults = array();

    while($professors->have_posts()) {
      $professors->the_post();
      array_push($professorResults, array(
        'title' => get_the_title()
      ));
    }

    return $professorResults;
  }

?>