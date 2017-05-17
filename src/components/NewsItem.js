import React from 'react';
import '../styles/NewsItem.scss';
import URL from 'url'; 
import { compareDate ,openAppWindow} from './common.js';


export default class NewsItem extends React.Component {  
	constructor(props){
		super(props);
		this.clickItem=this.clickItem.bind(this);
	}
	/*点击item，进入具体的项*/
	clickItem(event){ 
		event.stopPropagation();
        var $this = $(event.target).closest('.section_item'); 
        var    href ='https://huidunews.qccr.com/static/qccrnews/'+$this.attr('data-href'),
            link = $this.closest('.section_item').find('.section_item_container').attr('data-link'),
            _newsId = $this.parents('.section_item').attr('data-id'),
            catId = $this.parents('.section_item').attr('data-catid');  

       // 第三方资讯
        if (link == 1) {
        	getIp().then(function(ip){
        		signCreate('Hit/recordHit', {"catId":catId,"id":id, "userId": uid,"ip":ip })
        	}).then(function(){
        		console.log(href)
    		//	openAppWindow(href)
    		});; 
        } else {  
          //	openAppWindow(href);
        }
    }      

    /*获取左侧图片*/
    getPic(){  
    	return(<div className="section_item_container lazy" data-original={this.props.item.thumb}  style={{backgroundImage: 'url('+this.props.item.thumb+')'}}>
    		{this.ifNewsCorner()}
	    	<p className="time">{compareDate(this.props.item.inputdate)}</p></div>)
    } 

    /*是否有标签*/
    ifNewsCorner(){
    	if(this.props.item.news_corner){
    		return <p className="lable">{this.props.item.news_corner}</p>
    	}
    }

    /*获取右侧标题内容*/          
	getTitle() {
	 	return (
	 		<div className="section_item_text">
                <p className="title">{this.props.item.title}</p>
                <p className="sub-title">{this.props.item.description}</p>
            </div> );
	}

	/*获取右侧浏览数信息*/
	getScaleInfo(){ 
		return (<div className="section_item_bottom clearfix"><div className="read"><i className="iconfont icon-yanjing"></i><span data-count={this.props.item.virtual_count}>{this.props.item.virtual_count}</span></div><div className="xiaoxi"><i className="iconfont icon-xiaoxi"></i><span>{this.props.item.total}</span></div><div className="like"><i className="i-like iconfont icon-dianzanxianxing"></i><span data-count={this.props.item.virtual_like} className="num">{this.props.item.virtual_like}</span></div></div>)
	}    
	
	ListItem(){
		return (
	     	<div className="section_item clearfix" data-href={dataHref}  data-catid={this.props.item.catid} data-key={this.props.item.inputtime} data-id={this.props.item.id}>
	     		{this.getPic()}
	     		<div className="section_item_cont">
	     			{this.getTitle()}
	     			{this.getScaleInfo()}
	     		</div>
	     	</div>
	   );
	}

	render() { 
	 	return (  
	     	<div className="section_item clearfix" data-link={this.props.item.islink} data-href={this.props.item.islink?"detail\/"+this.props.item.catid+"-"+this.props.item.id+".shtml?t="+this.props.item.updatetime:this.props.item.url} data-catid={this.props.item.catid} data-key={this.props.item.inputtime} data-id={this.props.item.id} onClick={this.clickItem.bind(this)}>
	     		{this.getPic()}
	     		<div className="section_item_cont">
	     			{this.getTitle()}
	     			{this.getScaleInfo()}
	     		</div>
	     	</div>
	   );
	}

}