import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io,Socket } from 'socket.io-client';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
@Injectable({
  providedIn: 'root'
})
export class ChattingserviceService {

  constructor(private http:HttpClient) { 
this.socket = io(this.url);

  }
  user = {}
  private socket: Socket;
  private url = 'https://whatsappapi-srlb.onrender.com'; //for deployment
  //private url = 'http://localhost:8000';


  Registeruser(email:string,name:string,password:string):Observable<any>{
   return this.http.post<any[]>(this.url + "/users/saveusers" , {email:email,name:name,password:password})
  }
  Loginuser(email:string,password:string,checkpass:string):Observable<any>{
    return this.http.post<any[]>(this.url+"/users/checkuser" , {email:email,password:password,checkpass:checkpass})
   }

   getContacts(userId:any):Observable<any>{
    return this.http.get(this.url+"/users/"+userId)
   }
   setuser(data:any){
     this.user = data;    
   }

    
   listen(eventname:any):Observable<any> {
    return new Observable<any>(observer=>{
      this.socket.on(eventname,function(data:any){
        observer.next(data)
      })
    })
  }

  emit(eventname:any,data:any){
    this.socket.emit(eventname,data)
  }

  getUserToAdd(name:string):Observable<any>{
    return this.http.get(this.url+"/users/getUserToAdd/"+name)
  }

  NewConversation(friendId:string,userId:string):Observable<any>{
    return this.http.post<any[]>(this.url+"/converations/storeconversations",{users:[friendId,userId]});
  }

  deleteConversation(connectionId:string):Observable<any>{
    return this.http.delete(this.url+"/converations/deleteconversations/"+connectionId);
  }

  storeimage(formdata:any):Observable<any>{
   return this.http.post<any[]>(this.url+"/upload/uploadimages",formdata);
  }
  getImageOfUser(userId:string):Observable<any>{
    return this.http.get(this.url+"/getimage/"+userId)
  }
 
  getmessages(connectionId:string):Observable<any>{
    return this.http.get(this.url+"/messages/getmessages/"+connectionId);
  }

  savemessages(conversationId:string,from:string,to:string,message:string):Observable<any>{
    return this.http.post<any[]>(this.url+"/messages/savemessages",{conversationId:conversationId,from:from,to:to,message:message});
  }
}
