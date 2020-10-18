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
                <img :src="item.image" class="card-img m-2 pl-2" style="max-width:200px" alt="...">
                </div>
                <div class="col-8">
                <div class="card-body" >
                    <p class="card-title">{{item.name}}</p>
                    <p>Available In: <button class="btn btn-dark btn-sm" :id="'typesTriggerBtn' +  index" v-on:click="typesTrigger(index)">Hide</button></p>
                
                </div>
                
                <div :id="'typesTrigger' +  index">
                <hr>
                
                    <div :key="type" v-for="(type,subindex) in item.types">
                    


                        <div class="ml-4 mr-4 mb-3">
                            <p>{{subindex + 1}}</p>
                            <p>{{type.name}}</p>
                            <h6>Price: {{type.price}}</h6>
                            <p class="float-left">Quantity:</p>
                            <input v-model="itemquantities[index][subindex].selected"  type="text" style="border:0px; border-bottom:1px solid black; width:30%" value="0" class="ml-2">
                            
                        </div>
                        <p class="ml-4 ml-4"><span>{{type.quantity}}({{item.measurement}})</span> remaining</p>
                        <hr>
                    </div>
                
                </div>
                
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
            var itemNames = this.itemNames
            var itemquantities = this.itemquantities 

            firebase.firestore().collection("Users").doc(userId.toString()).get().then(function(doc) {
                for (let i = 0; i < doc.data().cartItems.length + 1; i++) {

                    var image = doc.data().cartItems[i].image
                    var name = doc.data().cartItems[i].name
                    var id = doc.data().cartItems[i].id
                    var measurement = doc.data().cartItems[i].measurement
                    var category = doc.data().cartItems[i].category
                    var types = doc.data().cartItems[i].types


                    items.push({name:name,image:image,measurement:measurement,category:category,types:types})
                    itemNames.push(name)

                    var singleQuantity = []
                    for (let i = 0; i < types.length; i++) {
                        singleQuantity.push({available:types[i].quantity,selected:0,price:types[i].price,name:types[i].name})
                    }
                    itemquantities.push(singleQuantity)

                }
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

        },
        
        cartInitialisePage:function(){
        
            var mainSection = document.getElementById("cartMainSection")
            var promtLoginScreen = document.getElementById("cartPromtLoginScreen")
            var initialiseFirebase = this.cartInitialiseFirebase
            var initialiseQuantities = this.initialiseQuantities


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
        removefromcart(name){

            var userId = firebase.auth().currentUser.uid
            var items = this.items
            var store = this.$store
            var itemNames = this.itemNames
            var carItemsQuantity = document.getElementById("cartItemsQuantity")
            var carItemsQuantityLogo = document.getElementById("cartItemsQuantityLogo")

            firebase.firestore().collection("Users").doc(userId).get().then(function(doc){
                
                var totalItems = doc.data().totalItems
                var cartItems = doc.data().cartItems
                var itemPosition = itemNames.indexOf(name)
               

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
                carItemsQuantityLogo.innerHTML = store.state.cartItemsNumber

            
            })


            
        },
        goToCheckout:function(){
            var userId = firebase.auth().currentUser.uid
            var itemQuantities = this.itemquantities
            var items = this.items
            var itemNames = this.itemNames
            var router = this.$router
            var totalPrice = 0
            var cartItemsHolder = this.cartItems
            cartItemsHolder = []
            var totalCartPrice = 0

            
            for (let i = 0; i < items.length; i++) {    


                    
                   

                    firebase.firestore().collection('Users').doc(userId.toString()).get().then(function(doc) {

                        var cartItems = doc.data().cartItems
                        var totalItems = doc.data().totalItems
                        
                        var types = []
                        
                        var accumilativePrice  = 0

                        for (let x = 0; x < itemQuantities[i].length; x++) {
                        
                            
                            var currentItem = itemQuantities[i][x]

                            if(currentItem.selected != 0){
                                var totalPrice = parseInt(currentItem.selected) * parseInt(currentItem.price)
                                types.push({totalPrice:totalPrice.toString(),name:currentItem.name,selected:currentItem.selected,price:currentItem.price})
                                accumilativePrice += totalPrice
                                totalCartPrice += totalPrice
                            }
                            if(x == itemQuantities[i].length - 1  ){
                                if(types.length == 0){   

                                    var name = cartItems[i].name
                                    var itemPosition = itemNames.indexOf(name)
                                    itemNames.splice(itemPosition,1);
                                    totalItems--
                                    alert("Item number " + (i + 1).toString()  + " is empty and will be removed from cart.")
                                     

                                     firebase.firestore().collection('Users').doc(userId.toString()).update({
                                            cartItems:cartItemsHolder,
                                            totalPrice:totalCartPrice,
                                            items:itemNames,
                                            totalItems:totalItems

                                    })
                                    if(x == 1){
                                        router.push("/Shop")
                                    }

                                }
                                else{
                                   
                                    var name = cartItems[i].name
                                    var image  = cartItems[i].image

                                    var newCartItem = {name:name,image:image,accumilativePrice:accumilativePrice,types:types}

                                    cartItemsHolder.push(newCartItem) 
                                
                                    if(i == items.length - 1){
                                        firebase.firestore().collection('Users').doc(userId.toString()).update({
                                            cartItems:cartItemsHolder,
                                            totalPrice:totalCartPrice,
                                            items:itemNames,
                                            totalItems:totalItems
                                        }).then(function(){
                                            router.push("/Checkout")
                                        })

                                    }
            
                                }
                            }
                              
                        }
                    

                    })


            }
        



        },
        typesTrigger:function(index){
            var triggerView = document.getElementById("typesTrigger" + index)
            var triggerBtn = document.getElementById("typesTriggerBtn" +  index)

            if(triggerView.style.display == "none"){
                triggerView.style.display = "block"
                triggerBtn.innerHTML = "Hide"
            }
            else{
                triggerView.style.display = "none"
                triggerBtn.innerHTML = "Show"
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