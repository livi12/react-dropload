## 基于React+Webpack+ES6开发的上拉加载，下拉刷新组件

 
[访问链接](https://livi12.github.io/react-dropload/index.html)  

#### 支持局部上拉刷新和全局上拉刷新

#### 局部上拉刷新对应的文件   NewsList1.js ，NewsList1.css  

```javascript

<Dropload  loadUpFn={this.loadUpFn.bind(this)}  loadDownFn={this.loadDownFn.bind(this)} scrollArea="true" >
  	<div className="newsListBox active" ref="newsListBoxRef" id="droplsit0"  data-lastkey={this.state.items[this.state.items.length -1].inputtime}>
    	{
    	this.state.items.map(function(item, index) {
        	return (
           	 	<NewsItem key={index} item={item} rank={index+1} />
            );
      	})
    	}
  	</div>  
</Dropload>

```    

全部上拉刷新对应的文件   NewsList.js ，NewsList.css 

```javascript

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
</Dropload>

```    

		`scrollArea` 默认为 windows ，当设置为true时，滚动区域为dropload 包裹区域，设置对应的css 样式。


