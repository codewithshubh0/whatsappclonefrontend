
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChattingserviceService } from '../services/chattingservice.service';
import { HostListener } from "@angular/core";
import { json } from 'stream/consumers';
import { NgxSpinnerService } from 'ngx-spinner';
declare var google:any ;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  screenWidth: number;
  loginForm : FormGroup
  registerForm : FormGroup
  leftchatcsschange:boolean = false;
  googlebtnmobile:boolean = false;
  loginpage:boolean=false;
  login:boolean = true;
  token_payload:string='';
  useremail = ''; 
  constructor(private route:Router, private chatservice:ChattingserviceService,private spinner:NgxSpinnerService){

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmpassword: new FormControl('', [Validators.required]),
    });

    if(localStorage.getItem("name")!=null || localStorage.getItem("name")!=undefined){
      this.route.navigate(["home"])
    }
    this.getScreenSize();
   
  }
  ngOnInit(){
    
      google.accounts.id.initialize({
        client_id: '639800582617-2la8dh8l0n5vdkirg91uqqmaidtn03s3.apps.googleusercontent.com',
        callback: (resp:any)=>{
            this.handleLogin(resp);
            this.chatservice.emit
               
             }
      })
  
   

    setTimeout(()=>{
        google.accounts.id.renderButton(document.getElementById("google-btn"),{
              theme:'filled_blue',
              size:'large',
              shape:'rectangle', 
              width:250
       })
   },1000)

   

   
  }

  ngAfterViewInit() {
    this.route.navigate(['/login'])
  }
  handleLogin(response:any){
  
    this.spinner.show();
    //extrct payload part from crediential
    this.token_payload = response.credential.split(".")[1];
  
    // decode payload to get info
    var decoded_token = JSON.parse(atob(this.token_payload.toString()));
    localStorage.setItem("loggedInUser",JSON.stringify(decoded_token));
    
    var name = JSON.parse(localStorage.getItem("loggedInUser")!).name;
     var email = JSON.parse(localStorage.getItem("loggedInUser")!).email;
  
      this.chatservice.Registeruser(email,name,'').subscribe((data)=>{
      
          //alert("sucessfully Registered");
          //this.login =true;
                  this.chatservice.Loginuser(email,'','false').subscribe((data)=>{
              //console.log(data+" getting data");
              
                    if(data!="User Not Found" && data!="wrong password"){

                     
                     // this.chatservice.addonlineuserindb(data["name"]).subscribe((data)=>{console.log(data); })
                     
                      localStorage.setItem("name",data["name"])
                      localStorage.setItem("userId",data["_id"])
                      this.spinner.hide();

                      //alert(data["name"]);
                      
                      this.chatservice.emit("joinning",{username:data["name"],msg:"new user login"})
                      
                      this.route.navigate(['home']);
   
                    }else{
                      this.spinner.hide();
                      alert(data)
                    }
              });
        
      });
  }
  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
      
          this.screenWidth = window.innerWidth;

          if(this.screenWidth<500){
            this.leftchatcsschange = true;
            this.googlebtnmobile = true;
          }else{
            this.leftchatcsschange = false;
            this.googlebtnmobile = false;
          }
    }

  
  onLoginSubmit(){
    
      if(this.loginForm.value['email']!='' && this.loginForm.value['password']!=''){
      this.chatservice.Loginuser(this.loginForm.value['email'],this.loginForm.value['password'],'true').subscribe((data)=>{
       
          if(data!="User Not Found" && data!="wrong password"){
            this.chatservice.setuser(data);
            localStorage.setItem("name",data["name"])
            localStorage.setItem("userId",data["_id"])
           // this.chatservice.addonlineuserindb(data["name"]).subscribe((data)=>{console.log(data); })
            this.chatservice.emit("joinning",{username:data["name"],msg:"new user login"})
            
            this.route.navigate(['home']);
            
            
          }else{
           
            alert(data)
          }
    });
  }else{
    alert("All Fields are Required")
  }
     
  }
  onRegisterSubmit(){
 if(this.registerForm.value['email']!='' && this.registerForm.value['name']!='' && this.registerForm.value['password']!='' && this.registerForm.value['confirmpassword']!=''){
    if( this.registerForm.value['password']==this.registerForm.value['confirmpassword']){

    this.chatservice.Registeruser(this.registerForm.value['email'],this.registerForm.value['name'],this.registerForm.value['password']).subscribe((data)=>{
      
      if(data=="1"){
        alert("sucessfully Registered");
        this.login =true;
        
      }else{
        alert("emailId is already registered")
      }
      
    });
  }else{
    alert("ConfirmPassword didn't match with Password")
  }
}else{
  alert("All Fields are Required")
}

  }

  displayRegister(){
    this.login = !this.login;
  }
}
