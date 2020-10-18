<template>
  <div class="mt-5">
    <div id="promtLoginScreen" class="jumbotron text-center" style="height:83vh">
      <div class="container mx-auto">
        <h6>You are not logged in.</h6>
        <div style="width:100%" class="float-left"> 
          <button data-toggle="modal" data-target="#loginModal" class="btn btn-primary pl-5 pr-5">Log in</button> <p class="pl-5 pr-5">Or</p> <router-link to="/Signup" class="btn btn-secondary pl-5 pr-5">Sign up</router-link> 
        </div>
      </div>
      
    </div>

    <div id="mainSection">
        <div class="container">
          <div class="row">

            <div class="col-8">
              <input class="form-control float-left" type="search" v-model="search" placeholder="Search" aria-label="Search" style="width:75%">
              <img src="../assets/Images/Icons/search.png" alt="" width="20" class="m-2" v-on:click="searchShop">

            </div>
            <!--
            <div class="col-4">
              <img src="../assets/Images/Icons/sort.png" alt="" width="30" class="m-2 float-right" data-toggle="modal" data-target="#staticBackdrop" >
              <img src="../assets/Images/Icons/filter.png" alt="" width="30" class="m-2 float-right">
            </div>
            -->

          </div>
        </div>

        <div class="jumbotron bg-white">
          <div class="row justify-content-center">
            
            <div v-for="(item,index) in items" :key="item" class="col-sm-3 col-6 mt-2 mb-2">
              <div class="card mx-auto" style="max-width:20rem;">
                <img class="card-img-top" v-bind:src="item.image" alt="Card image cap">
                <div class="card-body">
                  <p>{{item.name}}</p>
                  <p class="badge badge-light p-1 m-2">{{item.category}}</p>
                  <p>Available In: <button class="btn btn-dark btn-sm" :id="'availableTriggerBtn' +  index" v-on:click="availableTrigger(index)">Show</button></p>
                  
                  <div :id="'availableTrigger' +  index" style="display:none">
                    <hr>
                    <div :key="type" v-for="type in item.types">
                      <p>{{type.name}}</p>
                      <p>Ksh. {{type.price}}</p>
                      <p>{{type.quantity}}({{item.measurement}}) remaining</p>
                      <hr>
                    </div>
                  </div>
                  
                  <button class="btn btn-dark font-weight-bold" style="width:100%" v-bind:id="'addtocart' + index" v-on:click="addtocart(item.image,item.name,item.id,index,item.category,item.measurement,item.types)">Add to Cart</button>
                  

                </div>
              </div>
            </div>
            
            <p>{{item}}</p>
            
          </div>
        </div>
    </div>
    <!--  MODALS  -->

    <!--Filter Modal-->
    <div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      
      <div class="modal-dialog modalCenter">
       
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Sort</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            </button>
          </div>

          <div class="modal-body">
            <button class="btn btn-outline-dark m-3" style="width:100%;">Sort by Name</button>
            <button class="btn btn-outline-dark" style="width:100%;">Sort by Price</button>
          </div>


        </div>

      </div>

    </div>
    <!--Sort Modal-->
    
  
  </div>
</template>

<script>
import { firebase } from "@firebase/app";
import "@firebase/firestore";

export default{
  data(){
    return{
      mounter:0,
      item:"",
      items:[],
      names:[],
      itemNames:[],
      loading:false,
      search:''
    }
  },
  methods:{
    
    getCartItemsQuantity:function(){
      var userId = firebase.auth().currentUser.uid
      var carItemsQuantity = document.getElementById("cartItemsQuantity")
      var carItemsQuantityLogo = document.getElementById("cartItemsQuantityLogo")

      firebase.firestore().collection("Users").doc(userId.toString()).get().then(function(doc){
          
        carItemsQuantity.innerHTML = doc.data().totalItems.toString()
        carItemsQuantityLogo.innerHTML = doc.data().totalItems.toString()

      })

    },
    addtocart:function(image,name,id,index,category,measurement,types){
      var userId = firebase.auth().currentUser.uid
      var adddbtn = document.getElementById('addtocart' + index)
      var getCartItemsQuantity = this.getCartItemsQuantity
     
     if( adddbtn.innerHTML == 'Add to Cart'){
        adddbtn.innerHTML = "Adding..."
      }
      else{
        adddbtn.innerHTML = "Removing..."
      }
     
     

     

      firebase.firestore().collection('Users').doc(userId.toString()).get().then((docSnapshot) => {
        if (docSnapshot.exists) {
          
      

            firebase.firestore().collection('Users').doc(userId.toString()).get().then(function(doc) {
                if (doc.exists) {
                  var totalItems = doc.data().totalItems
                  var cartItems = doc.data().cartItems
                  var items  = doc.data().items
                  


                  if( doc.data().items.includes(name) ){
                    var itemPosition = items.indexOf(name)
                    cartItems.splice(itemPosition,1);
                    items.splice(itemPosition,1);
                    totalItems--

                    firebase.firestore().collection('Users').doc(userId.toString()).update({
                      totalItems:totalItems,
                      cartItems:cartItems,
                      items:items

                    })
                    .then(function() {
                      adddbtn.innerHTML = 'Add to Cart'
                      getCartItemsQuantity()
                    })
                    .catch(function(error) {
                      alert("Error writing document: ", error);
                    })

                  
                  }else{


                    cartItems.push({image,name,id,category,measurement,types})
                    totalItems++
                    items.push(name)

                    firebase.firestore().collection('Users').doc(userId.toString()).update({
                      totalItems:totalItems,
                      cartItems:cartItems,
                      items:items

                    })
                    .then(function() {
                      adddbtn.innerHTML = 'Remove from cart'
                      getCartItemsQuantity()
                      
                    })
                    .catch(function(error) {
                      alert("Error writing document: ", error);
                    })
                  }

                  
                } else {
                   
                    alert("No such document!");
                }
            }).catch(function(error) {
              console.log("Error getting document: ", error);
            });

            
        }
        else{

            var item = [{name:name,image:image,category:category,measurement:measurement,types:types}]
            console.log(item)
            firebase.firestore().collection('Users').doc(userId.toString()).set({
              cartItems:item,
              totalItems:1,
              items:[name],
              totalPrice:"0",
              awaitingPurchases:[]
             
            })


            .then(function() {
                adddbtn.innerHTML = 'Remove from cart'
                getCartItemsQuantity()
            })
            .catch(function(error) {
                alert("Error writing document:", error);
            })
        }
         
      })

    },
    initialiseFirebase:function(){ 
      var page = this
      var itemsCheck = this.items
      this.items = [] 

      firebase.firestore().collection("Hardware").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
              page.items.push(doc.data())
              page.names.push(doc.data().name)
              console.log(doc.data())
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

        var userId = firebase.auth().currentUser.uid
        var itemNames  = this.itemNames
        var names = this.names

        firebase.firestore().collection("Users").doc(userId.toString()).get().then(function(doc){
          itemNames = doc.data().items
          for (let i = 0; i < itemNames.length; i++) {

            var index = names.indexOf(itemNames[i]) 
            var adddbtn = document.getElementById('addtocart' + index)
            adddbtn.innerHTML = "Remove from Cart"
          }
        })

    },

    initialisePage:function(){
      var mainSection = document.getElementById("mainSection")
      var promtLoginScreen = document.getElementById("promtLoginScreen")
      var initialiseFirebase = this.initialiseFirebase

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          initialiseFirebase()
          mainSection.style.display = 'block'
          promtLoginScreen.style.display = 'none'
        } else {
          mainSection.style.display = 'none'
          promtLoginScreen.style.display = 'block'
        }
      });
    },
    availableTrigger:function(index){
      var triggerView = document.getElementById("availableTrigger" + index)
      var triggerBtn = document.getElementById("availableTriggerBtn" +  index)

      if(triggerView.style.display == "none"){
        triggerView.style.display = "block"
        triggerBtn.innerHTML = "Hide"
      }
      else{
        triggerView.style.display = "none"
        triggerBtn.innerHTML = "Show"
      }
    },
    searchShop:function(){
      var search = this.search
      var page = this
      var itemsCheck = this.items
      this.items = [] 

      firebase.firestore().collection("Hardware").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              var nameUn = doc.data().name
              var name = nameUn.toLowerCase()
              if(name.includes(search.toLowerCase())){
                page.items.push(doc.data())
                page.names.push(doc.data().name)
                console.log(doc.data())
              }
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

        var userId = firebase.auth().currentUser.uid
        var itemNames  = this.itemNames
        var names = this.names

        firebase.firestore().collection("Users").doc(userId.toString()).get().then(function(doc){
          itemNames = doc.data().items
          var name = doc.data().name
         
          for (let i = 0; i < itemNames.length; i++) {
            if(name == search){
            var index = names.indexOf(itemNames[i]) 
            var adddbtn = document.getElementById('addtocart' + index)
            adddbtn.innerHTML = "Remove from Cart"
            }
          }
        })
    }

  },
  mounted:function(){
 

    this.initialisePage()

  }

  
}
</script>

<style>
</style>