import React from 'react'
import { render } from 'react-dom';
import { signCreate,resize } from './common.js';

import $ from 'n-zepto';
import NewsList from './NewsList1.js';
import '../styles/nomerlize.scss'
import NewsHeader from './NewsHeader.js'; 
import Banner from './banner.js';
import { Router,Route,Link,browserHistory} from 'react-router'
import Detail from './Detail.js';

import '../styles/dropload.scss'; 

resize();

var bannerData=[
		{
			imgId:22,
			imgUrl:'https://newst02.qccr.com/static/qccrnews/detail/56-1796.shtml?t=1487059373',
			imgImage:'https://s00.qccr.com/qccr/g00/qccrnews/2017/02/4dfa8c0a94c69001.jpg',
			imgContent:'banner 图一'
		},
		{
			imgId:18,
			imgUrl:'https://newst02.qccr.com/static/qccrnews/detail/58-1744.shtml?t=1479367855',
			imgImage:'https://s00.qccr.com/qccr/g00/qccrnews/2016/12/6611ccc44c82dec1.jpg',
			imgContent:'banner 图二'
		} 
	]; 
var params={
    "catId": 0,
    "key":0,
    "pageSize":10 ,
    "userId":0 ,
    "siteId":1
}; 
signCreate('Content/getNewsList',params).then(function(items) {  
	render(
			<App data={items.info} />	
	,$('.container')[0])

}).catch(function(err) {
  console.log('error occur', err);
}); 

export default class App extends React.Component{
	constructor(props) {
	    super(props);
	    this.state={data:''}
	} 
	componentDidMount(){  
	}

	render(){ 
		return  (<div className="wrap">
			<Banner banners={bannerData} />
			<NewsHeader />
		   		<NewsList items={this.props.data}/> 
		</div>)
	}
}

