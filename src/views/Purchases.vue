<template>
  <div>
        <div>
            <div :key="item" v-for="(item,index) in items" class="mb-3 jumbotron" style="border-botttom:1px solid black" >
                <h1>{{index + 1}}</h1>
                <h5>Number of Items: <span>{{item.totalItems}}</span></h5>
                <h6>Total Price: <span>{{item.totalPrice}}</span></h6> 

                <h6>Payment Status: <span v-if="item.confirmed">Payment confirmed awaiting pickup</span><span v-if="!item.confirmed">Payment not confirmed(<a class="a" v-on:click="purchaseRequest(item.phoneNumber,item.totalPrice)" >Click Here</a> to get a payment request to {{item.phoneNumber}})</span></h6>

                <button class="btn btn-dark" :id="'showHide' + index" v-on:click="showHideItems(index)">Hide Items</button>

            

                <hr>
                
                <div style="display:block;" :id="'awaitingPurchases' + index" >
                    <div :key="awaitingItem" v-for="(awaitingItem,subindex) in item.items" class="row no-gutters m-3" style="border-bottom:1px solid black">
                        
                            
                            <div class="col-4">
                                
                                <img :src="awaitingItem.image" class="card-img pl-2" style="max-width:200px" alt="...">
                            </div>

                            <div class="col-8">

                                <div class="card-body"> 
                                    <h5 class="card-title">{{awaitingItem.name}}</h5>
                                    <h6>Item Grand Total: <span>{{awaitingItem.accumilativePrice}}</span></h6>

                                    <p>Items selected: <button class="btn btn-dark btn-sm" :id='"typeTriggerBtn" + index + subindex' v-on:click="typeTrigger(index,subindex)">Show</button> </p>
                                    
                                    <div :id='"typeTriggerView" + index + subindex' style="display:none">
                                        <div :key="type" v-for="(type,subsubindex) in awaitingItem.types" class="border border-secondary rounded d-block mx-auto p-3 m-2">
                                            <p class="text-center">{{subsubindex + 1}}</p>
                                            <p>{{type.name}}</p>
                                            <p>Unit price: {{type.price}}</p>
                                            <p>Quantity: {{type.selected}}</p>
                                            <p>Item Total: {{type.totalPrice}}</p>
                                        </div>
                                    </div>
                                </div>


                            
                            </div>
                        
                    </div>
                </div>

            </div>
      
        </div>
  </div>
</template>

<script>
import { firebase } from "@firebase/app";
import "@firebase/firestore";
import moment from 'moment'
export default {

    data(){

        return{
            items:[]
        }

    },
    methods:{

        loadPage:function(){

            var items = this.items
            var userId = firebase.auth().currentUser.uid

            

            firebase.firestore().collection("Users").doc(userId.toString()).get().then(function(doc) {
                var awaitingPurchases = doc.data().awaitingPurchases

                for (let i = 0; i < awaitingPurchases.length; i++) {
                    items.push(awaitingPurchases[i])
                }
             
                console.log(items)

            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

        },
        showHideItems:function(index){
            var awaitingPurchase = document.getElementById("awaitingPurchases" + index)
            var showHide = document.getElementById("showHide" + index)

            if(awaitingPurchase.style.display == "none"){
                awaitingPurchase.style.display = "block"
                showHide.innerHTML = "Hide Items"

            }
            else if(awaitingPurchase.style.display == "block"){
                awaitingPurchase.style.display = "none"
                showHide.innerHTML = "Show Items"

            }
        },
        purchaseRequest:function(phoneNumber,amount){
            var mpesa = require('mpesa-node-sdk');

            
            var dateMoment = moment(new Date()).format("YYYYMMDDHHmmss")
            var date = dateMoment.toString()

            var password = new Buffer.from("174379" + "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" + date).toString('base64')
            const request_options={
                "BusinessShortCode": "174379",
                "Password": password,
                "Timestamp": date,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": "254" + phoneNumber,
                "PartyB": "174379",
                "PhoneNumber": "254" + phoneNumber,
                "CallBackURL": "http://192.168.2.43:8080",
                "AccountReference": "test",
                "TransactionDesc": "test"
            }
            mpesa.STKPushSimulation(request_options,function(data){
                alert("Request Sent")
            })
        
        },
        typeTrigger:function(index,subindex){
            var triggerBtn = document.getElementById("typeTriggerBtn" + index + subindex)
            var triggerView = document.getElementById("typeTriggerView" + index + subindex)

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
        this.loadPage()
    },
    created: function () {
    }

}
</script>

<style>

</style>