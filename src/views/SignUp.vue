<template>
  
  <div class="signup">
    <div id="logreg-forms">
        
        <form class="form-signin" style="transform: translateY(60%) !important;">
        
            <h1 class="h3 mb-3 font-weight-normal text-center" style=""> Sign Up</h1>

            <div class="input-group mt-2 mb-2">
              <input type="email" id="inputEmail" class="form-control" placeholder="Email" v-model="email">
            </div>

            <div class="input-group mt-2 mb-2">
              <input type="text" id="inputPassword" class="form-control" placeholder="Password" v-model="password">
            </div>

            <div class="input-group">
              <p v-if="!loading" class="btn btn-md btn-rounded btn-block form-control submit" v-on:click="signup()" id="signUpBtn">Sign up</p>
              <p v-if="loading" class="btn btn-md btn-rounded btn-block form-control submit" v-on:click="signup()" id="signUpBtn">Sig up</p>
            </div>
            
        </form>

           
           
            

    </div>
  </div>
</template>

<script>
import { firebase } from "@firebase/app";
import "@firebase/auth";
export default {
    data(){
        return{
            email:'',
            password:'',
            loading:false
        }
    },
    methods:{
        
        signup:function(){
            var page = this
            var email = page.email
            var password = page.password
            var router = this.$router
            var loading = this.loading
            loading = true
                
            
                firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
                    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){

                            
                        router.push('/Shop')

               
                        
                    }).catch(function(error) {
                
                        var errorCode = error.code;
                        var errorMessage = error.message;

                        alert(errorMessage)
                    
                    })


                })
                .catch(function(error) {
                
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    alert(errorMessage)
                
                })

            
        }
            
        }

    }

</script>

<style>
 
.signup{
    background-image: url('../assets/Images/signupback.jpg');
   height:70vh;
   
}

#logreg-forms{
    width:80%;
    height:70vh;
    margin:10vh auto;
    background-color:white;
    box-shadow: 0 7px 7px rgba(0, 0, 0, 0.12), 0 12px 40px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}

#logreg-forms form {
    width: 100%;
    max-width: 410px;
    padding: 15px;
    margin: auto;
}
#logreg-forms .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
}
#logreg-forms .form-control:focus { z-index: 2; }
#logreg-forms .form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}
#logreg-forms .form-signin input[type="password"] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

#logreg-forms a{
    display: block;
    padding-top:10px;
    color:#fff;
}

#logreg-form .lines{
    width:200px;
    border:1px solid red;
}


#logreg-forms button[type="submit"]{ margin-top:10px; }

#logreg-forms .facebook-btn{  background-color:#3C589C; }

#logreg-forms .google-btn{ background-color: #DF4B3B; }

#logreg-forms .form-reset, #logreg-forms .form-signup{ display: none; }

#logreg-forms .form-signup .social-btn{ width:210px; }

#logreg-forms .form-signup input { margin-bottom: 2px;}

.submit{
  background: -webkit-linear-gradient(0deg,  #999999  0%, #000000 100%);
  border-radius: 25px;
  color: #fff;
}

/* Mobile */

@media screen and (max-width:500px){
    #logreg-forms{
        width:90%;
    }

    #logreg-forms  .social-login{
        width:200px;
        margin:0 auto;
        margin-bottom: 10px;
    }
    #logreg-forms  .social-btn{
        font-size: 1.3rem;
        font-weight: 100;
        color:white;
        width:200px;
        height: 56px;

    }
    #logreg-forms .social-btn:nth-child(1){
        margin-bottom: 5px;
    }
    #logreg-forms .social-btn span{
        display: none;
    }
    #logreg-forms  .facebook-btn:after{
        content:'Facebook';
    }

    #logreg-forms  .google-btn:after{
        content:'Google+';
    }
}
</style>