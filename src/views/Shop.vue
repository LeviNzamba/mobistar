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
      <div class="jumbotron bg-white" id="mainSection">
        <div class="row justify-content-center">
          
          <div v-for="(item,index) in items" :key="item" class="col-sm-3 col-6 mt-2 mb-2">
            <div class="card mx-auto" style="max-width:20rem;">
              <img class="card-img-top" v-bind:src="item.image" alt="Card image cap">
              <div class="card-body">
                <p>{{item.name}}</p>
                <p class="font-weight-bold"><span>Ksh.</span>{{item.price}}</p>
                
             
                
                <button class="btn btn-dark font-weight-bold" style="width:100%" v-bind:id="'addtocart' + index" v-on:click="addtocart(item.image,item.name,item.price,item.quantity,item.id,index)">Add to Cart</button>
                

              </div>
            </div>
          </div>
          
          <p>{{item}}</p>
          
        </div>
      </div>
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
      loading:false
    }
  },
  methods:{
    
    getCartItemsQuantity:function(){
      var userId = firebase.auth().currentUser.uid
      var carItemsQuantity = document.getElementById("cartItemsQuantity")

      firebase.firestore().collection("Users").doc(userId.toString()).get().then(function(doc){
          
        carItemsQuantity.innerHTML = doc.data().totalItems.toString()

      })

    },
    addtocart:function(image,name,price,quantity,id,index){
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


                    cartItems.push({image,name,price,id,quantity})
                    totalItems++
                    items.push(name)

                    firebase.firestore().collection('Users').doc(userId.toString()).update({
                      totalItems:totalItems,
                      cartItems:cartItems,
                      items:items

                    })
                    .then(function() {
                      firebase.firestore().collection('Users').doc(userId.toString()).set({
                        awaitingPurchases:[]
                      })
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
              alert("Error getting document:", error);
            });

            
        }
        else{
          
            firebase.firestore().collection('Users').doc(userId.toString()).set({
              cartItems:[{name:name,image:image,price:price,quantity:quantity}],
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
                alert("Error writing document: ", error);
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
    }
  },
  mounted:function(){
 

    this.initialisePage()

  }

  
}
</script>
