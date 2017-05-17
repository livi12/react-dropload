import React from 'react';
import ReactDOM from 'react-dom'; 
export default class Dropload extends React.Component  {
    constructor(props) {
        super(props);
        var me=this;
        me.state = {    

            scrollTop:0,
            loading:false,
            // 是否有更多内容可以加载
            loadMore:true,
            // 上拉提示
            upLoadMsg:props.uploadMsgTxt,
            // 刷新提示
            downLoadMsg:props.downloadMsgTxt,

            // 满足下拉刷新或者上拉更新时，重新赋值，使render渲染
            directionRender:'up' 
        }
        
        me.onTouchStart=me.onTouchStart.bind(me);
        me.onTouchMove=me.onTouchMove.bind(me);
        me.onTouchEnd=me.onTouchEnd.bind(me);
        me.onScroll=me.onScroll.bind(me);    
    }

    componentWillMount(){ 
        this.direction='up'; 
        this.loading=false; 
    }

    componentDidMount(){ 
        var me=this;
        if(me.props.scrollArea!=window){
            me.scrollAreaDom=me.refs.dropbox;
        }else{
            me.scrollAreaDom=window;
        }   
        me.windowResize();
        me.scrollAreaHeight();
        me.onScroll();  
    }
 
    //计算滚动的距离是否满足向下加载的条件 
    fnTouches(e){ 
        if(!e.touches){
            e.touches = e.originalEvent.touches;
        }
    }
    // 触摸开始事件
    onTouchStart(e){  
        var me=this;
        if(!me.state.loading){
            me.fnTouches(e);
            me._startY=e.touches[0].pageY;  
            // 记住触摸时的scrolltop值,判断滚动条的位置 
            if(me.props.scrollArea==window){
                me.touchScrollTop =document.body.scrollTop;  
            }else{
                me.touchScrollTop=me.scrollAreaDom.scrollTop;
            }
        }
    }

    //触摸移动事件
    onTouchMove(e){
        var me=this,distanceNum=this.props.distance;
        if(!me.state.loading){
            me.fnTouches(e);
            me._curY=e.touches[0].pageY;
            me._moveY = me._curY - me._startY;

            if(me._moveY > 0){
                me.direction = 'down';
            }else if(me._moveY < 0){
                me.direction = 'up';
            } 

            var _absMoveY = Math.abs(me._moveY);

            /*在顶部下拉，且没有被锁住*/
            if(me.touchScrollTop<=0 && me.direction == 'down' ){  
                me.setState({'directionRender':'down'});  
             //   me.transitionFn(uploadDom,300);

                var uploadDom=me.refs.upload; 
                // 下拉，下拉距离小于加载的距离，且方向向下
                if(_absMoveY<= distanceNum && me.direction=='down'){
                    me.offsetY =_absMoveY;  
                }else if(_absMoveY > distanceNum && _absMoveY <= distanceNum *2){
                    me._offsetY = distanceNum+(_absMoveY-distanceNum)*0.5; 
                }else{ 
                    me._offsetY = distanceNum+distanceNum*0.5+(_absMoveY-distanceNum*2)*0.2;
                } 
                if(uploadDom){
                    uploadDom.style.height=me._offsetY+'px'; 
                }
            }
        } 
    }

    //触摸结束事件
    onTouchEnd(e){
        var me=this;
        var uploadDom=me.refs.upload; 
        if(!me.state.loading){
            var _absMoveY = Math.abs(me._moveY);
            me.transitionFn(uploadDom,300); 
            if(me.touchScrollTop <= 0 &&me.direction == 'down' ){
                if(_absMoveY > me.props.distance){
                    uploadDom.style.height=uploadDom.children[0].clientHeight+'px'; 
                    me.setState({"loading":true}); 
                    me.state.loading = true;  
                    me.props.loadUpFn().then(function(data){
                        me.resetLoad(data);
                    });
                }else{ 
                    uploadDom.style.height=0; 
                    me.transitionEnd(uploadDom,function(){
                        me.setState({'directionRender':'up'}); 
                    }); 
                }
                me._moveY = 0;
            }
        } 
    } 

    // 窗口调整
    windowResize(){
        var me=this; 
        window.addEventListener('resize', function(){ 
            setTimeout( me.scrollAreaHeight.bind(me),500);
        });
    }

    // 动画执行完之后执行函数
    transitionEnd(dom,call){
        dom.addEventListener('webkitTransitionEnd',function(){
           call && call();
        }) 
        dom.addEventListener('transitionend',function(){
            call && call();
        }) 
    }

    // 操作窗口滚动事件
    onScroll(e){
        var me=this;  
        var scrollAreaDom=me.scrollAreaDom;
        scrollAreaDom.addEventListener('scroll',function(event) {  
            if(!me.state.loadMore)
                return;   
            if(scrollAreaDom==window){
                me.scrollTop=document.body.scrollTop;   
            }else{
                me.scrollTop=me.scrollAreaDom.scrollTop; 
            }  
            if(me.direction=='up' && !me.state.loading && (me.scrollContentHeight - me.props.threshold)<=(me.scrollWindowHeight + me.scrollTop)){  
                me.setState({'upLoadMsg':me.props.loadingMsg,'loading':true});
                me.props.loadDownFn().then(function(data){ 
                    me.resetLoad(data); 
                }); 
                
            }

        });
    }

    // 异步回调结束后执行的重置操作
    resetLoad(data){
        var me =this,loadMsg='',canloadMore=true,uploadDom=me.refs.upload; 
        // 下拉 
        if(me.direction=='down'){
            if(uploadDom){
                uploadDom.style.height=0; 
                me.transitionEnd(uploadDom,function(){
                    me.resetState(data); 
                });  
            }else{
                me.resetState(data); 
            }
        }else{
            me.resetState(data);
        }
    } 

    // 重置一些state值，方便加载完成后执行
    resetState(data){
        var me =this,loadMsg='',canloadMore=true;  
        if(data && data.state!='noData'){   
            me.direction='up';
            loadMsg= me.props.uploadMsgTxt; 
        }else if(data && data.state=='noData'){
            me.noData=true; 
            loadMsg= me.props.noloadMsg; 
            canloadMore=false; 
        } 
        me.setState({"loading":false,'upLoadMsg':loadMsg,'loadMore':canloadMore,"directionRender":'up'});
        me.getContentHeightFn();
    }
 
    // 重新获取文档的高度
    getContentHeightFn(){
        var me=this;  
        if(me.props.scrollArea==window){
            this.scrollContentHeight=document.body.scrollHeight;  
        }else{
           this.scrollContentHeight=this.scrollAreaDom.scrollHeight;  
        } 
    }

    // 加载过程中，加载动画
    transitionFn(dom,num,call){ 
        if(dom){
            dom.style.transition='all '+num+'ms';
            dom.style.webkitTransform='all '+num+'ms';
            dom.style.mozTransform='all '+num+'ms';
            dom.style.oTransform='all '+num+'ms'; 
        }
        call && call();
    }

    // 计算文档的高度，以及滚动窗口的高度
    scrollAreaHeight(){
        var me=this;
        if(me.props.scrollArea==window){ 
            this.scrollContentHeight=document.body.scrollHeight;  
            this.scrollWindowHeight=window.innerHeight;   
        }else{
            this.scrollContentHeight=this.scrollAreaDom.scrollHeight;  
            this.scrollWindowHeight=this.scrollAreaDom.clientHeight; 
        } 
    }

    render(){
         var Events = {
            onTouchStart : this.onTouchStart.bind(this),
            onTouchMove : this.onTouchMove.bind(this),
            onTouchEnd : this.onTouchEnd.bind(this), 
            onScroll:this.onScroll.bind(this)
        }
        var upLoadDom=null,downLoadDom=null;  
        // 滑动方向向上，上拉
        if(this.state.directionRender=='up'){
            // 正在加载中的样式
            if(this.state.loading){
                downLoadDom=<div className="dropload-down" ref="download"><div className="dropload-load"><div className="loading"></div></div></div>;
            // 下拉刷新的提示样式
            }else{ 
                // 有更多内容可以加载 
                if(this.state.loadMore){
                    downLoadDom=<div className="dropload-down" ref="download"><div className="dropload-refresh">{this.state.upLoadMsg}</div></div>;
                }else{
                    downLoadDom=<div className="dropload-down" ref="download"><div className="dropload-refresh">{this.this.props.noloadMsg}</div></div>;
                }
                
            }
            
        }else{ 
            // 正在加载中的样式
            if(this.state.loading){ 
                upLoadDom=<div className="dropload-up" ref="upload"><div className="dropload-load"><div className="loading"></div></div></div>
            }else{ 
                upLoadDom=<div className="dropload-up" ref="upload"><div className="dropload-refresh">{this.state.downLoadMsg}</div></div>
            }
        }  
        return <div  ref="dropbox" className="dropbox" {...Events}>
        {upLoadDom}
        {this.props.children}
        {downLoadDom}
        </div>
    }
}

Dropload.defaultProps={ 
    /*loadUpFn , loadDownFn 为异步函数，返回 promise 对象，便于链式操作异步结果，方便控制流程 */
    loadUpFn:function(){},
    loadDownFn:function(){},
    distance:50,
    threshold:30,
    scrollArea:window,
    uploadMsgTxt:'上拉加载更多',
    loadingMsg:'加载中',
    downloadMsgTxt:'下拉刷新',
    noloadMsg:'没有更多内容'
}

Dropload.propTypes = { 
  loadUpFn:React.PropTypes.func.isRequired,
  loadDownFn:React.PropTypes.func.isRequired
};
