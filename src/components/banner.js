import React from 'react';
import Swiper from 'swiper';
import '../styles/swiper-3.3.1.min.scss';
//import "./ah.js";
import { signCreate ,getIp,openAppWindow} from './common.js';
import "../styles/banner.scss"


export default class Banner extends React.Component{
	constructor(props) {
	    super(props);

	    this.swiperInit = this.swiperInit.bind(this); 
	    this.bannerClick = this.bannerClick.bind(this); 

	}

	componentDidMount() { 
		this.swiperInit();
  	}

  	componentWillUpdate(nextProps) {
    	// if (!nextProps.open && this.props.open) {
     //  		this._focusInDropdown = contains(
     //   	 		ReactDOM.findDOMNode(this.menu), activeElement(document)
     //  		);
    	// }
  	}

  	componentDidUpdate(prevProps) {
    	// const { open } = this.props;
    	// const prevOpen = prevProps.open;

    	// if (open && !prevOpen) {
     //  		this.focusNextOnOpen();
    	// }

	    // if (!open && prevOpen) {
	    //   // if focus hasn't already moved from the menu lets return it
	    //   // to the toggle
	    //   if (this._focusInDropdown) {
	    //     this._focusInDropdown = false;
	    //     this.focus();
	    //   }
	    // }
  	}


	render(){ 
		var bannerItem=(this.props.banners).map(function(item, index) {
			return <a key={index} className="swiper-slide" href="javascript:;" data-id={item.imgId} data-href={item.imgUrl} style={{backgroundImage: 'url('+item.imgImage+')'}}  onClick={this.bannerClick.bind(this)}><p className="txt">{item.imgContent}</p>
            </a> ;
		},this);
		return (
			<div className="swiper-container" ref="myswiper">
		        <div className="swiper-wrapper">  
		        	{bannerItem} 
		        </div>
		        <div className="swiper-pagination"></div>
		    </div>
		);
	}

	swiperInit(){
		var mySwiper = new Swiper ('.swiper-container', {
                loop: true,
                pagination: '.swiper-pagination',
                autoplay: 3000,
                autoplayDisableOnInteraction : false,
                onInit:function(mySwiper){
                    if(mySwiper.slides.length<=1){
                        mySwiper.stopAutoplay();
                        $('.swiper-pagination').hide();
                    }
                }
            });   
	}

	bannerClick(event){
		var domTarget=$(event.target);
		var dataHref=domTarget.attr('data-href'),id=domTarget.attr('data-id');
		getIp().then(function(ip){		
			var params={ 
	            "userId":0,
	            "ip":ip,
	            "id":id,
	            "source":1
	        }
			signCreate('Statistical/posterClick',params).then(function(){
				openAppWindow(dataHref);
			});  
		}) 
	}
}