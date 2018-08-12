<?php get_header();
 
  pageBanner(array(
    'title' => 'All Events',
    'subtitle' => 'See what\'s going on at Code School!'
  ));
?>

<div class="container container--narrow page-section">
  <?php 
    while(have_posts()) {
      the_post(); 

      get_template_part('template-parts/content-event');

     } ?>

    <!-- Pagination -->
    <?php echo paginate_links(); ?>
    
    <hr class="section-break">
    <p>Looking for a recap of past events? <a href="<?php site_url('/past-events') ?>">Click here.</a></p>
</div>


<?php get_footer(); ?>