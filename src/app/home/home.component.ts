import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ChattingserviceService } from '../services/chattingservice.service';
import { Buffer } from 'buffer';
import { DomSanitizer } from '@angular/platform-browser';
import { HostListener } from "@angular/core";
import {formatDate } from '@angular/common';
import { ViewportScroller } from '@angular/common';
import { DatePipe } from '@angular/common';
declare var google:any ;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // @ViewChild('chatelement',{static:true}) containerElement:ElementRef
  @ViewChildren('messages') messages: QueryList<any>;
@ViewChild('chatelement') chatelement: ElementRef;
  objectKeys = Object.keys;
  public showchat:Boolean =true
  public showallchatpage:Boolean = true
  public profilepage:Boolean = sessionStorage.getItem("profilepage")=='true'?true:false;
  public showarchieved = false;
  public noedit:Boolean = true;
  public noedit1:Boolean = true;
  public showpic:Boolean = true;
  public showdrop:Boolean = false;
  public showdropchat:Boolean = false;
  public notclicked = false; //make it true if want to display new message update
  public backstyle:string = 'chat' ;
  public imgurl:string = "./assets/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png"; 
  public uploadimg = "./assets/Upload-Transparent-Images.png"
  public mychatpic = "./assets/default-user-image.png"
  resultdp = './assets/default-user-image.png'
  public sendicon = "./assets/946743-small.png"
  public displayname =""
  public message:Array<string>= [];
  public newuserjoined :Array<{user:string, message:string}>= [];
  public friendsList :Array<[name:string,convId:string,userId:string,imgurl:string]> = [];
  public messageslist:Array<{message:string,from:string,msgdate:string}> =[]
  resultForName:string="No User"
  public connectionslist:any=[];
  public friends:Array<{name:string,connId:string,imgurl:string}>=[];
  public friendsbackup:Array<{name:string,connId:string,imgurl:string}>=[];
  public friendchatpic = "./assets/default-user-image.png"
  searchValue:any =''
  messagetxt:any =''
  Name:string = sessionStorage.getItem("name")?.toString() || ""
  userdetail:any = {}
  screenHeight: number;
  screenWidth: number;
  openchat: boolean = true;
  leftchatcsschange:boolean = false;
  searchinputcss = "width: 323px;padding-left: 29px;"
  clickforchat = false;
  openchatcsschange:boolean = false;
  moblescreen:boolean=  false;
  time:any


  constructor(private router:Router,private service:ChattingserviceService,private _sanitizer: DomSanitizer,private viewportScroller:ViewportScroller,private datepipe:DatePipe){
     if(sessionStorage.getItem("showallchatpage")==null)
        sessionStorage.setItem("showallchatpage","true");
        this.backstyle = 'chat'

    if(sessionStorage.getItem("profilepage")==null)
        sessionStorage.setItem("profilepage","false");
        this.backstyle = 'chat'

    if(sessionStorage.getItem("showarchieved")==null)
        sessionStorage.setItem("showarchieved","false");
        this.backstyle = 'chat'

     this.userdetail = this.service.user   
     this.service.listen("new message").subscribe((data)=>{
      //alert(data.user + " "+ data.message);

      this.messageslist.push({message:data.message,from:data.user,msgdate:this.datepipe.transform(data.date, 'MMM d, y, h:mm a')+""})
    }) 
const userId = sessionStorage.getItem("userId")?.toString() || ""
    this.service.getContacts(userId).subscribe((allConnection)=>{
         //this.friends = allConnection
             
              this.connectionslist = allConnection

              
              for(let conn of Object.keys(allConnection)){
                var img = '';
                this.service.getUserToAdd(conn).subscribe({
                  next:(data)=>{
                     // console.log(JSON.stringify(data)+" getting ths user");
                          
                    if(data!=null){
                           this.service.getImageOfUser(data._id).subscribe((data)=>{
                           // console.log(data+" getting image");
                            
                              if(data!=null || data!=undefined){
                                var thumb = Buffer.from(data.image.data).toString('base64');    
                                 img = "data:"+data.image.contentType+""+";base64,"+thumb;
                                 this.friends.push({name:conn,connId:allConnection[conn],imgurl:img})
                                
                              }else{
                                img = "./assets/default-user-image.png"
                                this.friends.push({name:conn,connId:allConnection[conn],imgurl:img})
                              }   
                            })
                    }else{
                      alert("User doesn't exist")
                    }
                          
                  },
                  error:(error)=>{
                    console.log(error);
                    
                  }
                 })


                
              }

            this.friendsbackup = this.friends;
  }) 
  this.getScreenSize();
}

@HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;

          if(this.screenWidth<500){
            this.leftchatcsschange = true;
            this.openchatcsschange = true;
            this.moblescreen = true;
            this.openchat = false
          }else{
            this.openchat = true
            this.leftchatcsschange = false;
            this.openchatcsschange = false;
            this.moblescreen = false;
          }
    }
    enablesend = false;
    enablesendbtn(msg:any){
    if(msg && msg!=''){
      this.enablesend = true;
    }else{
      this.enablesend = false;
    }
    }
  ngOnInit(): void {
    if(sessionStorage.getItem("name")==null || sessionStorage.getItem("name")==undefined){
      this.router.navigate(["login"]);
    }
  this.getImage();
  }
  ngAfterViewInit() {
    this.scrollToBottom();
    this.messages.changes.subscribe(this.scrollToBottom);
  }
  
  scrollToBottom = () => {
    try {
      this.chatelement.nativeElement.scrollTop = this.chatelement.nativeElement.scrollHeight;
    } catch (err) {}
  }
  getImage(){
    const userId = sessionStorage.getItem("userId")?.toString() || ""
    this.service.getImageOfUser(userId).subscribe((data)=>{
      if(data!=null || data!=undefined){
        var thumb = Buffer.from(data.image.data).toString('base64');    
        this.imgurl = "data:"+data.image.contentType+""+";base64,"+thumb;
       // alert("hry"+this.imgurl)
       
      }   
 })
  }
 
  calculateDiff(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);
 
     return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
   }
  sendmsg(msg:any){
  //  this.viewportScroller.scrollToPosition([0,document.body.scrollHeight])
    var today = new Date();
     this.time = formatDate(today,"h:MM TT",'en-US', '+0530');
     if(msg==''){
      alert("please write message first");
      return;
     }
    this.message.push(msg);
    //sessionStorage.setItem("message",JSON.stringify(this.message));
    var connId = sessionStorage.getItem("connectionId") || ''
    var currdate = this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss a')
    if(connId!=''){
      
      this.service.emit("message",{user: this.Name,room:connId,message:msg,date:currdate})
      this.messagetxt =''
    }
    var userId = sessionStorage.getItem("userId") || ''
    this.service.savemessages(connId,this.Name,msg,currdate).subscribe({
       next:(data)=>{
        console.log(data);
        // this.messageslist.push({})
       },
       error:(error)=>{
        console.log(error);
        
       }
    })
    // const container = this.containerElement.nativeElement;
    // container.scrollToPosition([0,container.screenHeight])
    // this.viewportScroller.scrollToPosition([0,document.body.scrollHeight])
  }

  About:string = localStorage.getItem("About") || ""
  displayChatwithmessages(friend:any){
    if(this.screenWidth<500){
       this.clickforchat = true;
    }else{
        this.clickforchat = false
    }
    sessionStorage.setItem("connectionId",friend.connId);
  //  console.log(JSON.stringify(friend)+" friend details");
    
    this.showchat = false;
   this.service.getUserToAdd(friend.name).subscribe({
    next:(data)=>{
       // console.log(JSON.stringify(data)+" getting ths user");
            
      if(data!=null){
             this.service.getImageOfUser(data._id).subscribe((data)=>{
              //console.log(data+" getting image");
              
                if(data!=null || data!=undefined){
                  var thumb = Buffer.from(data.image.data).toString('base64');    
                  this.friendchatpic = "data:"+data.image.contentType+""+";base64,"+thumb;
                  //console.log(this.mychatpic+" getting chat pic");
                  
                }else{
                  this.friendchatpic = "./assets/default-user-image.png"
                }   
              })
      }else{
        alert("no data")
      }
            
    },
    error:(error)=>{
      console.log(error);
      
    }
   })
    

    var connId = sessionStorage.getItem("connectionId") || ''
   this.service.emit("join",{user:this.Name,room:connId}) 

   this.displayname = friend.name;

   this.messageslist =[];
   this.service.getmessages(connId).subscribe((data)=>{
       
     if(data[0]!=null || data[0]!=undefined){
        for(let msg of data){
          for(let m of msg.messages){
            this.messageslist.push({message:m.message,from:m.from,msgdate:this.datepipe.transform(m.dateandtime, 'MMM d, y, h:mm a')+""});
          }
        }
     }
    
   })


  }

  closechat(){
    this.showchat = true;
    this.notclicked = false;
    this.showdropchat = false;
    this.clickforchat = false;
    this.backstyle = 'chat'
  }

  deletechat(){
    
    var connId = sessionStorage.getItem("connectionId")?.toString() || "";
    if(connId!=""){
       this.service.deleteConversation(connId).subscribe((data)=>{
           //alert(data);
           this.notclicked = false;
           this.showdropchat = false;  
           window.location.reload()   
      })
    }
    this.clearchat()
   
  }

  clearchat(){
    var connId = sessionStorage.getItem("connectionId")?.toString() || "";
    
    if(connId!=""){
      this.service.clearchat(connId).subscribe((data)=>{
          //alert(data);
         console.log(data);
         
     })
   }

  }

  profileUpdate(){
    sessionStorage.setItem("showallchatpage","false");
    sessionStorage.setItem("profilepage","true");
     sessionStorage.setItem("showarchieved","false");
     this.showallchatpage = sessionStorage.getItem("showallchatpage")=='true'?true:false;
     this.profilepage = sessionStorage.getItem("profilepage")=='true'?true:false;
     this.showarchieved = sessionStorage.getItem("showarchieved")=='true'?true:false;
  }
  backtochat(){
    sessionStorage.setItem("showallchatpage","true");
    sessionStorage.setItem("profilepage","false");
    window.location.reload()
  }
  filterchat(filterwith:any){
    this.friendsbackup = this.friends; 
    var val = filterwith.target.value;
    if (val) {
      if(val==''){
        this.friendsbackup = this.friendsbackup.filter(p => p.name !== val)
      }else{
        this.friendsbackup = this.friendsbackup.filter(p => p.name === val)
      }
      
    }
  }
  removefilter(){
    this.searchValue =''
    this.friendsbackup = this.friends;
  }
  editName(){
    this.noedit = false;
  }
  editdone(name:string){
    sessionStorage.setItem("Name",name);
    this.noedit = true;
    window.location.reload()
  }

  editAbout(){
    this.noedit1=false;
  }

  editAboutDone(about:string){
    localStorage.setItem("About",about);
    this.noedit1 =true;
    window.location.reload();
  }

  onSelectFile(e:any){
    
    var userId = sessionStorage.getItem("userId") || '';
    const file = e.target.files[0];
    console.log(file);
    const formdata = new FormData();
    formdata.append("image",file);
    formdata.append("userId",userId)
    this.service.storeimage(formdata).subscribe((data)=>{
      // console.log(data+" data afte save");
       window.location.reload() 
    })
 
    
  }

  showUploadOption(){
    this.showpic = !this.showpic;
  }

  showdropdown(){
    this.showdrop = !this.showdrop
  }
  showdropdownchat(){
    this.showdropchat = !this.showdropchat
  }
  Addchat(){
    sessionStorage.setItem("showallchatpage","false");
    sessionStorage.setItem("profilepage","false");
    this.showallchatpage = sessionStorage.getItem("showallchatpage")=='true'?true:false;
    this.profilepage = sessionStorage.getItem("profilepage")=='true'?true:false;
  }
  logout(){

    google.accounts.id.disableAutoSelect();
    sessionStorage.clear();
    this.router.navigate(["login"])
  }

  goback(){
    sessionStorage.setItem("showallchatpage","true");
    sessionStorage.setItem("profilepage","false");
    this.profilepage = sessionStorage.getItem("profilepage")=='true'?true:false;
    this.showallchatpage = sessionStorage.getItem("showallchatpage")=='true'?true:false;
    this.resultdp = './assets/default-user-image.png'
  }

  openarchieve(){
    sessionStorage.setItem("showarchieved","true");
    sessionStorage.setItem("showallchatpage","false");
    sessionStorage.setItem("profilepage","true");
    this.showarchieved = sessionStorage.getItem("showarchieved")=='true'?true:false;
    this.showallchatpage = sessionStorage.getItem("showallchatpage")=='true'?true:false;
    this.profilepage = sessionStorage.getItem("profilepage")=='true'?true:false;
  }

  searchchat(name:string){
    this.service.getUserToAdd(name).subscribe((data)=>{
     
      if(data=="-1"){
        this.resultForName ="No User Found"
      }else{
        if(data["name"]!=this.Name){
            this.resultForName = data["name"];
            
            this.service.getUserToAdd(this.resultForName).subscribe({
              next:(data)=>{
        
                if(data!=null){
                       this.service.getImageOfUser(data._id).subscribe((data)=>{
                      //  console.log(data+" getting image");
                        
                          if(data!=null || data!=undefined){
                            var thumb = Buffer.from(data.image.data).toString('base64');    
                            this.resultdp = "data:"+data.image.contentType+""+";base64,"+thumb;
                            
                          }else{
                            this.resultdp = "./assets/default-user-image.png"
                          }   
                        })
                }else{
                  alert("no data found")
                }
                      
              },
              error:(error)=>{
                console.log(error);
                
              }
             })
            }
        else
           this.resultForName = "sorry! You Can't add Yourself"
          }
    })
  }

  addUser(){

    this.service.getUserToAdd(this.resultForName).subscribe((data)=>{
      var userId = sessionStorage.getItem("userId")?.toString() || '';
       if(data["_id"]!=null && userId!=null){

            this.service.NewConversation(data["_id"],userId).subscribe((data1)=>{
              if(data1=="new conversation saved"){
                sessionStorage.setItem("showallchatpage","true");
                sessionStorage.setItem("profilepage","false");
                window.location.reload();
              }else if(data1=="Already Added"){
                alert("Aleady Added");
                // sessionStorage.setItem("showallchatpage","true");
                // sessionStorage.setItem("profilepage","false");
                // window.location.reload();
              }
            });
       }   
      
      
    })


   
  }
}
