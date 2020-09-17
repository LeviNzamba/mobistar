<template>
  <div> 
  <header class="masthead text-center text-dark">
    <div class="masthead-content">
      <div class="container p-4 border-rounded" style="width:50%;background-color:rgba(255, 255, 255,0.4);">
        <h1 class="masthead-subheading mb-0">Mobistar Hardware</h1>
        <h6>Get your hardware today.</h6>
        <router-link to="/Shop" class="btn btn-dark">Go to shop </router-link>
      </div>
    </div>
  </header>

  <section>
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6 order-lg-2">
          <div class="p-5">
            <img class="img-fluid" src="../assets/Images/1.jpg" alt="">
          </div>
        </div>
        <div class="col-lg-6 order-lg-1">
          <div class="p-5">
            <h2 class="display-4">Quality Products</h2>
            <p>With our wide variety of products, you are able to select anything together with it's mesurements and specifications.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <div class="p-5">
            <img class="img-fluid" src="../assets/Images/2.jpg" alt="">
          </div>
        </div>
        <div class="col-lg-6">
          <div class="p-5">
            <h2 class="display-4">Easy Shopping</h2>
            <p>Make and pay for your order without leaving the comfort of your home..</p>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- Footer -->
  <footer class="py-5 bg-black">
    <div class="container">
      <p class="m-0 text-center text-white small">Copyright &copy;Mobistar 2020</p>
    </div>
    <!-- /.container -->
  </footer>



  </div>
</template>

<script>
import { firebase } from "@firebase/app";
import "@firebase/auth";
export default {

}
</script>