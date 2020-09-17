<template>
  <div>
    <div class="text-center" id="mainPage">
      <div class="jumbotron">
        
        <h5>Items: <button class="btn btn-dark btn-sm" id="ShowOrHideBtn" v-on:click="ShowOrHideItems">Show</button></h5>
    
        <div class="m-2" id="itemsColumn">

          <div :key="item" v-for="(item,index) in items" class = "border border-secondary rounded d-block mx-auto p-3 m-2">

            <p>{{index + 1}}</p>
            <h6>{{item.name}}</h6>
            <p>Unit Price: {{item.price}}</p>
            <p>Quantity: {{item.selectedQuantity}}</p>
            <p>Grand Total: {{item.accumilativePrice}}</p>
            

          </div>

        </div>

        <h5 >Total Price: <span id="totalPrice">{{totalPrice}}</span></h5> 
        

      </div>

      <div class="float-left input-group text-center">
          <div class="row" style="width:100%">
            <div class="col-12">
              <label for="phoneNumber" class="mr-1">Phone Number:</label>
              <input id="phoneNumber" type="text" placeholder="" style="width:50%" v-model="phoneNumber">
            </div>
          </div>
          
            <div class="d-block mx-auto">
              <button class="btn btn-success m-2" v-on:click="mpesaInitiateTransaction">Lipa Na Mpesa</button>
            </div>
        </div>
    
    </div>
    <div id="confirmationPage" class="jumbtoron text-center m-2" style="display:none">
      <img src="../assets/Images/tick.png" class="img-fluid d-block mx-auto" width="100">
      <h3>Request succesfully sent</h3>
      <p>Once the purchase is confirmed an email will be sent to your email account.</p>
      <router-link to="/Purchases" class="btn btn-success">Check your purchases</router-link>
    </div>
  </div>
</template>

<script>
import { firebase } from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import moment, { duration } from 'moment'

export default {
  data(){
    return{
      items:[],
      totalPrice:[],
      phoneNumber:"",
      itemsShown:false
    }
  },
  methods:{
    checkoutInitialisePage:function(){
      var userId = firebase.auth().currentUser.uid
      var items  = this.items
      var totalPrice = this.totalPrice
      var totalPriceTextBox = document.getElementById("totalPrice") 
      var itemsColumn = document.getElementById("itemsColumn")
      itemsColumn.style.display = 'none'



      firebase.firestore().collection("Users").doc(userId.toString()).get().then(function(doc) {
    
        var totalPriceFromFirebase = doc.data().totalPrice
        totalPriceTextBox.innerHTML = totalPriceFromFirebase
        totalPrice.push(totalPriceFromFirebase)
       

        
        for (let i = 0; i < doc.data().cartItems.length + 1; i++) {

            var image = doc.data().cartItems[i].image
            var price = doc.data().cartItems[i].price
            var name = doc.data().cartItems[i].name
            var id = doc.data().cartItems[i].id
            var quantity = doc.data().cartItems[i].quantity
            var selectedQuantity = doc.data().cartItems[i].selectedQuantity
            var accumilativePrice = doc.data().cartItems[i].accumilativePrice

        
            items.push({name:name,image:image,price:price,quantity:quantity,selectedQuantity:selectedQuantity,accumilativePrice:accumilativePrice})
           
        }
       
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
      

      
    
    },
    ShowOrHideItems:function(){
      var itemsColumn = document.getElementById("itemsColumn")
      var ShowOrHideBtn = document.getElementById("ShowOrHideBtn")

      if(this.itemsShown){
        itemsColumn.style.display = 'none'
        ShowOrHideBtn.innerHTML = "Show"
        this.itemsShown = false
      }
      else{
        
        itemsColumn.style.display = 'block'
        ShowOrHideBtn.innerHTML = "Hide"
        this.itemsShown = true
      }
    },
    mpesaInitiateTransaction:function(){



        var confirmPurchaseInitiate  = this.confirmPurchaseInitiate

        var mpesa = require('mpesa-node-sdk');

        var phoneNumber = this.phoneNumber
        var totalPrice = this.totalPrice[0]
         
        const format = "YYYYMMDDHHmmss"
        var dateCreate = new Date()
        var dateMoment = moment(dateCreate).format(format)

        var date = dateMoment.toString()

        var password = new Buffer.from("174379" + "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" + date).toString('base64')
        const request_options={
            "BusinessShortCode": "174379",
            "Password": password,
            "Timestamp": date,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": totalPrice,
            "PartyA": phoneNumber,
            "PartyB": "174379",
            "PhoneNumber": phoneNumber,
            "CallBackURL": "http://192.168.2.43:8080",
            "AccountReference": "test",
            "TransactionDesc": "test"
        }
        mpesa.STKPushSimulation(request_options,function(data){
          confirmPurchaseInitiate()
        })

    },
    confirmPurchaseInitiate:function(){
      var confirmationPage = document.getElementById("confirmationPage")
      var mainPage = document.getElementById("mainPage")

      mainPage.style.display  = "none"
      confirmationPage.style.display = "block"

      var userId = firebase.auth().currentUser.uid

      var items = this.items
      var totalPrice = this.totalPrice[0]
      var cartItemsNumber = this.$store.state.cartItemsNumber
      var carItemsQuantity = document.getElementById("cartItemsQuantity")
      var phoneNumber = this.phoneNumber

      firebase.firestore().collection("Users").doc(userId.toString()).get().then(function(doc){
      
        
        var awaitingPurchases = []
        var totalItems = doc.data().totalItems



        awaitingPurchases = doc.data().awaitingPurchases
        awaitingPurchases.push({
          items:items,
          totalPrice:totalPrice,
          totalItems:totalItems,
          confirmed:false,
          phoneNumber:phoneNumber
        })
      
        carItemsQuantity.innerHTML = "0"

        
        firebase.firestore().collection("Users").doc(userId.toString()).update({
          //Clear the cart
          totalItems:"0",
          cartItems:[],
          items:[],
          totalPrice:"0",
          //Setting awiting purchases
          awaitingPurchases:awaitingPurchases


        })
      
        
       
      })

      
    }

  },
  mounted:function(){
    
    this.checkoutInitialisePage()
    

  }

}
</script>

<style>

</style>