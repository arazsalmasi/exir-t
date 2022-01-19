
import React from 'react';
import { render } from 'react-dom';
import Chart from './../charts/charts';
import { Layout, Menu, Button,Radio } from 'antd';
import "./homestyle.css";
const io = require("socket.io-client");
const { Header, Content, Footer } = Layout;
const socket = io("https://api.exir.io/realtime", {
  query: { symbol: "btc-usdt" },
});

class Home extends React.Component {
	componentDidMount() {

    this.get_data();
    
    socket.on("connect", () => {
      console.log("con");
    });



	}

  componentWillUnmount(){

     socket.on("disconnect", () => {
       console.log("discon");
     });

  }

  state = {
    
    data: [],
    loading:false,
    baze:'month',
    //start from 1 days ago
    from:Date.now() - (24*60*60*1000),
    //to now
    to:  Date.now(),
        
  };
  // get first ata from api
  get_data() {
    this.setState({loading:true})

    //lice 3 characters for test date work well

     let to = this.state.to.toString();
     let toto = to.slice(0, -3);
     let from = this.state.from.toString();
     let fromfrom = from.slice(0, -3); 

    //this dates for fro and to has data for chart
    //https://api.exir.io/v1/chart?symbol=btc-usdt&resolution=1D&from=${fromfrom}&to=${toto}
    fetch(`https://api.exir.io/v1/chart?symbol=btc-usdt&resolution=60&from=${fromfrom}&to=${toto}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        //create new array for change time to date
        let newArray = [];
        json.forEach(res=>{
      
          let aaa = {
            date: res.time,
            open: res.open,
            low: res.low,
            high: res.high,
            close: res.close,
            volume: res.volume
          }
          newArray.push(aaa)
        })
        this.setState({data:newArray,loading:false})
      })
      .then(() => {
       // get realtie data from socket
       
        socket.on("trades", (data) => {
          console.log("socket io",data["btc-usdt"])
          let newArray = [];
          data["btc-usdt"].forEach(res=>{
        
            let aaa = {
              date: res.timestamp,
              open: 46854.5,
              low: res.price,
              high: res.price,
              close: 48594.3,
              volume: res.size
            }
            newArray.push(aaa)
          })
          
        

    this.setState({ data: [...this.state.data, ...newArray] })
        });
       
      })
      .catch((error) => {
        console.error(error);
      });
  }

   handleBazeChange = e => {
    this.setState({ baze: e.target.value });
    if(e.target.value ==='day'){
    
      //set state 1 days ago for from
      this.setState({from:Date.now() - (24*60*60*1000),})
    }else{
    
      //set state 1 month ago for from
      this.setState({from:Date.now() - (720*60*60*1000),})
    }
    this.get_data();
  };


	render() {
		 if (this.state.loading === true) {
		 	return <div className="center-loading" >Loading...</div>
		 }
		return (
            <Layout>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            </Header>
            <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, }}>
              <div  className="site-layout-background ">
              <Radio.Group value={this.state.baze} onChange={this.handleBazeChange} >
                <Radio.Button value="day">One Day</Radio.Button>
              
                <Radio.Button value="month">One Month</Radio.Button>
              </Radio.Group>
              <Chart data={this.state.data}  /> 
              
              </div>
            </Content>
            <Footer style={{ textAlign: 'center',marginTop: 64, }}>exir @ 2022</Footer>
          </Layout>
			
		
		)
	}
}
export default Home;
