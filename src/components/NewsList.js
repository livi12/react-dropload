import React from 'react';
import ReactDOM from 'react-dom';
import NewsHeader from './NewsHeader.js';
import NewsItem from './NewsItem.js';
import Banner from './banner.js';
import '../styles/NewsList.scss'; 
import Dropload from './dropload.js'
import { signCreate} from './common.js';

import '../styles/dropload.scss'; 

export default class NewsList extends React.Component {
    constructor(props){
      super(props);
      this.getMoreItem=this.getMoreItem.bind(this);
      this.state={items:this.props.items}; 
      this.loadUpFn=this.loadUpFn.bind(this);
      this.loadDownFn=this.loadDownFn.bind(this);
    }

    componentDidMount(){
    //  this.dropdownEvent();
     // this.getMoreItem();     
   }

    getMoreItem(keyId){ 

      var _this=this;
      var params={
          "catId": 0,
          "key":keyId,
          "pageSize":10 ,
          "userId":0 ,
          "siteId":1
      };  
      return signCreate('Content/getNewsList',params).then(function(items){   
        if(items.code==0){
          if(params.key!=0 &&params.key!=undefined){
            items.info && _this.setState({items: _this.state.items.concat(items.info) });
          }else{
            items.info && _this.setState({items:items.info });
          } 
          return items.info.length<10?{'state':'noData'}:{'state':'load'}
        }else{ 
          return {'state':'error'}
        }
      });
    }

    loadUpFn(){
      return this.getMoreItem(undefined);
    }

    loadDownFn(){ 
      var DomWrap=ReactDOM.findDOMNode(this.refs.newsListBoxRef); 
      var keyId=DomWrap.getAttribute('data-lastkey'); 
      return this.getMoreItem(keyId);
    }
    render() {   
    	return (
  	    <div className="newsList" > 
            <Dropload  loadUpFn={this.loadUpFn.bind(this)}  loadDownFn={this.loadDownFn.bind(this)}>
    	      	<div className="newsListBox active" ref="newsListBoxRef" id="droplsit0"  data-lastkey={this.state.items[this.state.items.length -1].inputtime}>
                	{
                	this.state.items.map(function(item, index) {
                    	return (
                       	 	<NewsItem key={index} item={item} rank={index+1} />
                        );
                  	})
                	}
              	</div>
              <div className="newsListBox" id="droplsit1" /> 
              <div className="newsListBox" id="droplsit2" /> 
              <div className="newsListBox" id="droplsit3" /> 
            </Dropload>
  	    </div>
  	    );
  	}
}