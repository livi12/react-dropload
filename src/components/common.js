import React from 'react';
import $ from 'n-zepto'; 
import ah from "./ah.js";

/*字体大小设置*/
export function resize() {
	window.remFontSize = document.documentElement.clientWidth *12 /375 ;
	document.documentElement.style.fontSize = document.documentElement.clientWidth *12 /375 + "px"; 
	var b = null;
	window.addEventListener("resize", function() {
		clearTimeout(b),
			b = setTimeout(resize, 300);
	}, !1); 
}

/*异步接口调用*/
export function  signCreate(method,param){  
    var promise = new Promise(function(resolve, reject){
        var urlStr='https%3A%2F%2Fapi.'+'qic'+'hecha'+'oren'+'.com%2Fsuperapi%2Fnewsprod%2F';
    	var str='',dataUrl=decodeURIComponent(urlStr); 
        $.ajax({
            url: dataUrl+method, 
            data:param,
            dataType: "jsonp", 
            success:function(data){
            	resolve(data);
            },
            error:function(err){
            	reject(err)
            }
        }); 
    });	
   return promise;
} 
/*获取用户的IP地址*/
export function getIp(){
	return new Promise(function(resolve,reject){
		var ip='';  
	    if(!window.localStorage||localStorage.firstIn==undefined || JSON.parse(localStorage.userIp) && JSON.parse(localStorage.userIp).expires < (new Date()).getTime()){
	        var js=document.createElement('script');
	        js.type='text/javascript';
	        js.src='https://pv.sohu.com/cityjson';
	        $('body').append(js)
	        js.onload = js.onreadystatechange = function() { 
	            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
	                ip=returnCitySN.cip.toString();  
	                /*设置过期时间为30分钟*/
	                var time=(new Date()).getTime() + 30*60*1000; 
	                var userIpObj={value:ip,expires:time}
	                if(window.localStorage){
	                    localStorage.userIp=JSON.stringify(userIpObj);
	                    localStorage.firstIn=false;
	                } 
	               js.onload = js.onreadystatechange = null;
	               resolve(ip)
	            }
	        };
	    }else{
	        ip=JSON.parse(localStorage.userIp).value;
	       	resolve(ip)
	    }  
	}); 
}

/*打开新的窗口*/
export function openAppWindow(href){
	if(ah.inApp){
        ah.callapp([['toNewsDetail',href]])
    }else{
        window.location.href = href;
    }
}

/*跳转到app中调用登陆的方法*/
export function appLogin(){
    //用户没有登陆
    if(ah.inApp){
        ah.callapp(['login'])
    }
}

/*获取URL上指定的参数值*/
export function getQueryString(name){
    var urls;
    if (window.location.href.indexOf("?") != window.location.href.lastIndexOf("?"))
        urls = window.location.href.replace(/\?/g, "&").replace(/^.*?&/, "");
    else
        urls = window.location.href.replace(/^.*\?/, "");
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = ("?" + urls).substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

/*对日期格式进行转换*/
export function compareDate(time,type){ 
    time = time.replace(/-/g, '/');
    var updateTime = new Date(time); 
    var now = new Date();
    var year, month, day;
    time='';
    if(type){
        var minute=updateTime.getMinutes()<10?'0'+updateTime.getMinutes():updateTime.getMinutes();
        time=' '+updateTime.getHours()+':'+minute;
    }

    if( updateTime.getFullYear()== now.getFullYear()&& updateTime.getMonth() == now.getMonth()&& updateTime.getDate() == now.getDate()){ 
        return "今天"+time; 
    }else if(updateTime.getFullYear()== now.getFullYear()&& updateTime.getMonth() == now.getMonth()&&now.getDate() == parseInt(updateTime.getDate() + 1)){
        return "昨天"+time;
    }else{
        year = updateTime.getFullYear();
        month = updateTime.getMonth() + 1;
        day = updateTime.getDate();
        return year + '-' + month + '-' + day;
    }
}

/*获取用户id*/
export function getUserId(call){
    if(ah.inApp){
        ah.callapp(['getUserId'],function(obj){
            uid=obj['getUserId'].length>0?obj['getUserId']: 0;
            call&& call();
        });
    }else{
         uid= common.getQueryString('userId')|| 0;
         call&& call();
    }
}