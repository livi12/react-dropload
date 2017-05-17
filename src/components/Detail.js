import React from 'react'
import { render } from 'react-dom';
import { signCreate,resize } from './common.js';

import $ from 'n-zepto';

export class Detail extends React.Component{
	constructor(props){
		super(props)
	}

	render(){
		return (<div className="detail">I am Detail</div>)
	}
}