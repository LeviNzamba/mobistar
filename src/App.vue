<template>
  <div id="app">
  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
    <div class="container">
      <a class="navbar-brand" href="#" style="width:60%">Mobistar Hardware</a>
      
      <router-link to="/Cart" class="navbar-brand cartLogo" href="#">
        <img src="./assets/Images/Icons/cart.png" width="30" height="30" alt="ddd">
        <span class="badge badge-light" style="font-size:10px;" id="cartItemsQuantityLogo"></span>
      </router-link>

      <button class="navbar-toggler" style="width:15%" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        
        <ul id="nav" class="navbar-nav ml-auto">
          
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Shop" class="nav-link">Shop</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Cart" class="nav-link">Cart <span class="badge badge-light" id="cartItemsQuantity"></span></router-link>
          </li>
          <li class="nav-item" id="login">
            <a class="nav-link" data-toggle="modal" data-target="#loginModal">Login</a>
          </li>
          <li class="nav-item " id="account">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Account
              </a>
            <div class="accountDrop bg-white dropdown-menu bg-dark text-dark text-center p-3 border-rounded" style="" aria-labelledby="navbarDropdown">
              <h6 id="userEmail" class=""></h6>
              <hr>
              <router-link to="/Purchases"><a class="text-dark border border-secondary p-2 border-rounded m-3">Purchases</a></router-link>
              <br>
              <br>
              <a class="text-dark border border-secondary p-2 border-rounded" v-on:click="signout">Sign Out</a>
            </div>
          </li>
        </ul>


      </div> 

    
    </div>
  </nav>

  <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalTitle" aria-hidden="true">
    
    <div class="modal-dialog modalCenter" role="document">
    
      <div class="modal-content">
        <div class="modal-header">
    
          <h5 class="modal-title" id="loginModalTitle">Login</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
    
        </div>
    
        <div class="modal-body">
      
         <form>
  
          <div class="form-group">
  
            <label for="userPhone">Email</label>
            <input type="email" class="form-control" id="userPhone" aria-describedby="emailHelp" placeholder="Email" v-model="email">
  
          </div>
  
          <div class="form-group">
  
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="password">
  
          </div>
  
         
         <div class="text-dark float-left">
           <p>Don't have an account? <router-link to="/Signup" data-dismiss="modal">Sign Up.</router-link></p>
         </div>
       
        </form>
  
        </div>
    
        <div class="modal-footer">
           <button type="submit" class="btn btn-primary" v-on:click="login">Log in</button>
        </div>
    
      </div>
    
    </div>

  </div>   
  <router-view/>
  </div>
</template>

<script>
import { firebase } from "@firebase/app";
import "@firebase/auth";
export default {
  data(){
    return{
      account:'',
      email:'',
      password:''

    }
  },
  methods:{
    setquantity:function(){
      var carItemsQuantityLogo = document.getElementById("cartItemsQuantityLogo")
      carItemsQuantity.innerHTML = "gg"
    },
    login:function(){
      var email =  this.email
      var password =  this.password
      var account = this.account
      
      var updateProfile = this.updateProfile

      var loginNav = document.getElementById("login")


      firebase.auth().signInWithEmailAndPassword(email,password).then(function(){
        
        alert("Sign in successfull")
        updateProfile()
        
        

      }).then(function(){
        location.reload(true)
      })
      .catch(function(error){
        alert(error.message)
      })
      
      
      
    
    
    },
    signout:function(){
      
      var updateProfile = this.updateProfile
 

      firebase.auth().signOut().then(function(){
        alert("Sign out successfull")
        updateProfile()
      }).catch(function(error){
        alert(error.message)
      })
    },
    getCartItemsQuantity:function(){
      var userId = firebase.auth().currentUser.uid
      var store = this.$store
      var carItemsQuantity = document.getElementById("cartItemsQuantity")
      var carItemsQuantityLogo = document.getElementById("cartItemsQuantityLogo")

      firebase.firestore().collection("Users").doc(userId.toString()).get().then(function(doc){
          
        store.state.cartItemsNumber = doc.data().totalItems
        carItemsQuantity.innerHTML = store.state.cartItemsNumber
        carItemsQuantityLogo.innerHTML = store.state.cartItemsNumber

      })
      

    },
    updateProfile:function(){

      var loginNav = document.getElementById("login") 
      var accountNav = document.getElementById("account")
      var account = document.getElementById("userEmail")
      var carItemsQuantity = document.getElementById("cartItemsQuantity")
      var carItemsQuantityLogo = document.getElementById("cartItemsQuantityLogo")
      var getCartItemsQuantity = this.getCartItemsQuantity
      var nav =  document.getElementById("nav")

      nav.style.display = 'none'

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          loginNav.style.display = 'none'
          accountNav.style.display = 'block'
          account.innerHTML = user.email
          getCartItemsQuantity()
          
          
        } else {
          loginNav.style.display = 'block'
          accountNav.style.display = 'none'
          carItemsQuantity.innerHTML = ""
          carItemsQuantityLogo.innerHTML = ""
        }

        nav.style.display = 'flex'

      });





    }
  }
  ,
  mounted: function(){

    this.updateProfile()   

  },
  created() {

    this.updateProfile()

  }

}
</script>

<style>
  body{font-family:Lato}h1,h2,h3,h4,h5,h6{font-family:Catamaran;font-weight:800!important}.btn-xl{text-transform:uppercase;padding:1.5rem 3rem;font-size:.9rem;font-weight:700;letter-spacing:.1rem}.bg-black{background-color:#000!important}.rounded-pill{border-radius:5rem}.navbar-custom{padding-top:1rem;padding-bottom:1rem;background-color:rgba(0,0,0,.7)}.navbar-custom .navbar-brand{text-transform:uppercase;font-size:1rem;letter-spacing:.1rem;font-weight:700}.navbar-custom .navbar-nav .nav-item .nav-link{text-transform:uppercase;font-size:.8rem;font-weight:700;letter-spacing:.1rem}header.masthead{position:relative;overflow:hidden;padding-top:calc(7rem + 72px);padding-bottom:7rem;background-image: url("assets/Images/storefront.jpg");background-repeat:no-repeat;background-position:center center;background-attachment:scroll;background-size:cover}header.masthead .masthead-content{z-index:1;position:relative}header.masthead .masthead-content .masthead-heading{font-size:4rem}header.masthead .masthead-content .masthead-subheading{font-size:2rem}header.masthead .bg-circle{z-index:0;position:absolute;border-radius:100%;background:linear-gradient(0deg,#ee0979 0,#ff6a00 100%)}header.masthead .bg-circle-1{height:90rem;width:90rem;bottom:-55rem;left:-55rem}header.masthead .bg-circle-2{height:50rem;width:50rem;top:-25rem;right:-25rem}header.masthead .bg-circle-3{height:20rem;width:20rem;bottom:-10rem;right:5%}header.masthead .bg-circle-4{height:30rem;width:30rem;top:-5rem;right:35%}@media (min-width:992px){header.masthead{padding-top:calc(10rem + 55px);padding-bottom:10rem}header.masthead .masthead-content .masthead-heading{font-size:6rem}header.masthead .masthead-content .masthead-subheading{font-size:4rem}}.bg-primary{background-color:#ee0979!important}.btn-primary{background-color:#ee0979;border-color:#ee0979}.btn-primary:active,.btn-primary:focus,.btn-primary:hover{background-color:#bd0760!important;border-color:#bd0760!important}.btn-primary:focus{box-shadow:0 0 0 .2rem rgba(238,9,121,.5)}.btn-secondary{background-color:#ff6a00;border-color:#ff6a00}.btn-secondary:active,.btn-secondary:focus,.btn-secondary:hover{background-color:#c50!important;border-color:#c50!important}.btn-secondary:focus{box-shadow:0 0 0 .2rem rgba(255,106,0,.5)}
  .modalCenter{
    transform: translateY(50%) !important;
  }
  .accountDrop{
    margin-left:80%;
  }
  .cartLogo{
    display: none;
  }
  
  @media screen and (max-width:500px){
    
    .accountDrop{
      margin-left:0;
    }

  }
  
  
  @media screen and (max-width:780px){

    .cartLogo{
      display: block;
    }

  }
  
</style>
