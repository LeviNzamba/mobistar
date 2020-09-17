<template>

  <div>
      
    <div id="cartPromtLoginScreen" class="jumbotron text-center" style="height:83vh">
      <div class="container mx-auto">
        <h6>You are not logged in.</h6>
        <div style="width:100%" class="float-left"> 
          <button data-toggle="modal" data-target="#loginModal" class="btn btn-primary pl-5 pr-5">Log in</button> <p class="pl-5 pr-5">Or</p> <router-link to="/Signup" class="btn btn-secondary pl-5 pr-5">Sign up</router-link> 
        </div>
      </div>
      
    </div>
        <div class="card mb-3" id="cartMainSection">
            <div :key="item" v-for="(item,index) in items" class="row no-gutters" style="border-bottom:1px solid black">
               
                <div class="col-4">
                <img :src="item.image" class="card-img mt-5 pl-2" style="max-width:200px" alt="...">
                </div>
                <div class="col-8">
                <div class="card-body">
                    <h5 class="card-title">{{item.name}}</h5>
                    <p class="card-text">Price: <span>{{item.price}}</span></p>
                </div>

                <div class="ml-4 mr-4 mb-3">
                    <p class="float-left">Quantity:</p>
                    <input v-model="itemquantities[index]"  type="text" style="border:0px; border-bottom:1px solid black; width:30%" value="1" class="ml-2">
                    
                </div>

                <p class="ml-4 ml-4"><span>{{item.quantity}}</span> remaining</p>
                
                <img src="../assets/Images/Icons/remove.png" class="img-fluid m-3 float-right" width="40" v-on:click="removefromcart(item.name)" alt="">
               
                </div>
            
            </div>
            <button v-on:click="goToCheckout" class="btn btn-dark m-3 float-right">Go to Checkout</button>
           
        </div>
  </div>
</template>

<script>

import { firebase } from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";

export default {
    data(){
        return{
            items:[],
            itemNames:[],
            itemquantities:[],
            cartItems:[]
        }
    },
    methods:{
    
        cartInitialiseFirebase:function(){

            var userId = firebase.auth().currentUser.uid
            var items  = this.items
            var itemquantities = this.itemquantities 

            firebase.firestore().collection("Users").doc(userId.toString()).get().then(function(doc) {
                for (let i = 0; i < doc.data().cartItems.length + 1; i++) {

                    var image = doc.data().cartItems[i].image
                    var price = doc.data().cartItems[i].price
                    var name = doc.data().cartItems[i].name
                    var id = doc.data().cartItems[i].id
                    var quantity = doc.data().cartItems[i].quantity

                
                    items.push({name:name,image:image,price:price,quantity:quantity})
                    itemquantities.push("1")

                }
                loadingScreen.style.display = 'none'
                mainScreen.style.display = 'block'
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

        },

        initialiseQuantities:function(){

            

        },
        
        cartInitialisePage:function(){
        
            var mainSection = document.getElementById("cartMainSection")
            var promtLoginScreen = document.getElementById("cartPromtLoginScreen")
            var initialiseFirebase = this.cartInitialiseFirebase
            var initialiseQuantities = this.initialiseQuantities


            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                initialiseFirebase()
                initialiseQuantities()
                mainSection.style.display = 'block'
                promtLoginScreen.style.display = 'none'
                } else {
                mainSection.style.display = 'none'
                promtLoginScreen.style.display = 'block'
                }
            });
            
        },

        removefromcart(name){

            var userId = firebase.auth().currentUser.uid
            var items = this.items
            var store = this.$store
            var itemNames = this.itemNames
            var carItemsQuantity = document.getElementById("cartItemsQuantity")

            firebase.firestore().collection("Users").doc(userId).get().then(function(doc){
                
                var totalItems = doc.data().totalItems
                var cartItems = doc.data().cartItems
                var itemPosition = items.indexOf(name)
                itemNames = doc.data().items
               

                cartItems.splice(itemPosition,1);
                items.splice(itemPosition,1);
                itemNames.splice(itemPosition,1);
                totalItems--

                firebase.firestore().collection('Users').doc(userId.toString()).update({
                    totalItems:totalItems,
                    cartItems:cartItems,
                    items:itemNames

                })
                store.state.cartItemsNumber = totalItems
                carItemsQuantity.innerHTML = store.state.cartItemsNumber

            
            })


            
        },
        goToCheckout:function(){
            var userId = firebase.auth().currentUser.uid
            var itemQuantities = this.itemquantities
            var items = this.items
            var router = this.$router
            var totalPrice = 0
            var cartItemsHolder = this.cartItems
            cartItemsHolder = []


            
            for (let i = 0; i < items.length; i++) {    
                var availableQuantity = parseInt(items[i].quantity)
                var selectedQuantity = parseInt(itemQuantities[i])
                var accumilativePrice = parseInt(items[i].price) * parseInt(itemQuantities[i]) 

                totalPrice += items[i].price * itemQuantities[i]

                if(selectedQuantity > availableQuantity){
                    var wrongItem = i + 1
                    alert("The selected quantity is more than the one avaiulable for item number " + wrongItem.toString())


                }
                else{

                    
                   

                    firebase.firestore().collection('Users').doc(userId.toString()).get().then(function(doc) {

                        var cartItems = doc.data().cartItems

                        var selectedQuantity =  itemQuantities[i]
                        var accumilativePriceCalculateResult = parseInt(items[i].price) * parseInt(itemQuantities[i]) 
                        var accumilativePrice = accumilativePriceCalculateResult.toString()

                        var name = cartItems[i].name
                        var price = cartItems[i].price
                        var image  = cartItems[i].image
                        var quantity = cartItems[i].quantity

                        var newCartItem = {name:name,price:price,image:image,quantity:quantity,accumilativePrice:accumilativePrice,selectedQuantity:selectedQuantity}

                        cartItemsHolder.push(newCartItem) 
                     
                        if(i == items.length - 1){
                            firebase.firestore().collection('Users').doc(userId.toString()).update({
                                cartItems:cartItemsHolder,
                                totalPrice:totalPrice
                            }).then(function(){
                                router.push("/Checkout")
                            })

                        }

                    })

                    if(i == items.length - 1){
                        
                        

                    }

                }
                    
            }
        



        }
    
    },

    mounted:function(){

        this.cartInitialisePage()
    
    }

}
</script>

<style>

</style>