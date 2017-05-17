import React from 'react'; 
import '../styles/header.scss';
import { signCreate} from './common.js'; 

export default class NewsHeader extends React.Component {  
	constructor(props){
		super(props);
		//this.setState({downList: null});
	}

	tabClick(event){   
        var $this=$(event.target).closest('li'); 
        if($this.hasClass('active'))
            return false; 
        var swiperHeight=$('.swiper-container').height();
        $('.swiper-container').addClass('hidden');
        $('.header').css({
            'position': 'fixed',
            'top':0,
            'left':0
        });
        $('.newsList').css('padding-top',$('.header').height());
        var idx=$this.index(),
            catId=$this.attr('data-catid');
            var obj=$('#droplsit'+idx);  
        $this.addClass('active').siblings().removeClass('active');
        obj.addClass('active').siblings().removeClass('active');
       // $(window).scrollTop(_me.getCount(idx, 'scroll')||0);
        if(obj.children('.section_item').length<10){
            obj.attr('noData',true);
        }
        this.changeTabData(obj,catId,0); 
    }
	/*tab 切换时是否请求接口获取列表数据*/
	changeTabData(obj,catId,userId){
		if(!obj.hasClass('loaded')){
            obj.addClass('loaded'); 
            obj.attr('data-catid',catId); 
            signCreate('Content/getNewsList',{"catId": catId,"key":0,"pageSize":10 ,"userId":userId ,"siteId":1}).then(function(data){

            },function(error){

            })
        }else{
            common.userVisit(userId,catId,null,2)
        }
	}

  	render() {
  		var navLinks = [
		 	{
		   		'dataCatid': '0',
				'name': '全部'
		 	},
		 	{
		   		'dataCatid': '79',
		   		'name': '福利'
		 	},
		 	{
			   'dataCatid': '81',
			   'name': '互动'
		 	},
		 	{
			   'dataCatid': '87',
			   'name': '资讯'
		 	},
		 	{
			   'dataCatid': '85',
			   'name': '技巧'
		 	}
		];
		var headItem=navLinks.map(function(item,index) {
		           return (
			           	<li key={index} className={index==0?"active":""} data-catid={item.dataCatid} >
		                    <a className="channelName" href="javascript:;"  onClick={this.tabClick.bind(this)}>{item.name}</a>
		                </li> 
		            ); 
		       	},this)
		return (
		    <ul className="header">
		       {headItem}
		    </ul>);  
	}

}