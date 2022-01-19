
import React from 'react';
import { render } from 'react-dom';
import Chart from './../charts/charts';
import { Layout, Menu, Button,Radio } from 'antd';
const {Header } = Layout;
class HeaderSec extends React.Component {

 
	render() {
		return (
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            </Header>
		)
	}
}
export default HeaderSec;
