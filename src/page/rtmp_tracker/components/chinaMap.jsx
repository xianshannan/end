import React from 'react'
import Component from 'libs/react-libs/Component'
import ReactDOM from 'react-dom'
import * as Antd from 'antd'
import d3 from 'd3'
import chinaMapGeo from 'libs/d3-geo/china.json'
import cityPosition from 'libs/d3-geo/city.json'
import * as city_s_setting from '../data/province_city_all'

class ChinaMap extends Component {
	constructor(){
		super(); 
		this.fillColor = [ ];
		this.province_coord = [ ];
	}

	dataAdapter(){
		var _this = this;
		return {
			/**
			 *	根据用户数取颜色，越多颜色越亮
			 *@param [float] 百分比 如0.8
			 */
			getProFillColor(pecent){
				var min_rgb = [40,63,98], 
					max_rgb = [156,176,207], 
					r_d = max_rgb[0]-min_rgb[0],
					g_d = max_rgb[1]-min_rgb[1],
					b_d = max_rgb[2]-min_rgb[2];
				var rgb = { }
				rgb.r = parseInt(max_rgb[0] - (r_d - pecent * r_d)); 
				rgb.g = parseInt(max_rgb[1] - (g_d - pecent * g_d)); 
				rgb.b = parseInt(max_rgb[2] - (b_d - pecent * b_d)); 
				return rgb;
			},
			/**
			 *	设置各省颜色
			 */
			setProvFillColor(posts,max_users){
				chinaMapGeo.features.forEach(function(value,key){
					var province = value.properties.name; 
					if(posts[province]){
						var rgb_num = _this.getProFillColor(posts[province].ActiveUsers / max_users);
						var rgb = "rgb(".concat(rgb_num.r,',',rgb_num.g,',',rgb_num.b,')')
						_this.fillColor.push(rgb);
						_this.province_coord.push(value.geometry.coordinates)
					}else{
						//无数据省颜色统一
						_this.fillColor.push("#283F62")
					}
				})
			},
			/**
			 *	设置城市点颜色
			 */
			setCityIconColor(data){
				var valueOfP = d3.scale.linear()
						.domain([0, 0.6, .8, 1])
						.range([{ r: 0, g: 255, b: 0 }, { r: 255, g: 255, b: 0 }, { r: 255, g: 128, b: 128 }, { r: 255, g: 0, b: 0 }]);
				var up = data.upSpeed / data.totalUpSpeed;
				var down = data.downSpeed / data.totalDownSpeed;
				var c1 = valueOfP(up);
				var c2 = valueOfP(down);
				//取上下行最大值为颜色取值
				var c = up > down ? c1 : c2;
				return d3.rgb(c.r, c.g, c.b);
			},
			setD3ChinaMapPath(){
				var	width = this.conDom.offsetWidth,
					height = this.conDom.offsetHeight;
				var scale = width;
				if(width > height){
					scale = height;
				}
				this.projection = d3.geo.mercator()
									.center([100, 38])
									.scale(scale + 60)
									.translate([width/2, height/2]);
			
				this.path = d3.geo.path()
								.projection(this.projection);
			}
		}
	}

	events(){
		var _this = this;
		return {
			showData(key){
				return function(e){
					e.stopPropagation();	
					_this.props.parent.setState({
						show_table : key
					})
				}
			},
			mouseover(key){
				var fillColor = { }
				fillColor[key] = "yellow";
				this.setState({
					fillColor : fillColor,
				})
			},
			mouseout(key){
				this.setState({
					fillColor : this.fillColor 
				})
			}
		}
	}

	componentDidMount(){
		let { posts,posts2,max_users } = this.props
		this.conDom = ReactDOM.findDOMNode(this).parentNode;	
		//处理省份颜色
		this.setProvFillColor(posts,max_users);
		//console.debug(this.fillColor)
		this.setState({
			canRender : true
		})
	}

    render() {
		var _this = this;
		let { posts,posts2,parent } = this.props
	    if(this.state && this.state.canRender){
			//处理d3
			this.setD3ChinaMapPath();
			return (
				<svg className="svg_china_map">
					<g transform="translate(0,0)">
						{
							chinaMapGeo.features.map(function(value,key){
								//console.log(value)
								var color = _this.fillColor[key];
								var province_name = value.properties.name;
								var content = '';
								if(posts[province_name]){
									content = '用户数：'.concat(posts[province_name].ActiveUsers); 
									return (
										<Antd.Popover key={ key } overlay={content} title={province_name} trigger="hover">	
											<path key={key} stroke="#213859" strokeWidth="1" fill={color} d={ _this.path(value) }/>
										</Antd.Popover> 
									)
								}else{
									return(
										<path key={key} stroke="#213859" strokeWidth="1" fill={color} d={ _this.path(value) }/>
									)
								}
								
							})
						}
					</g>
					<g>
						{
							posts2.map(function(value,key){
								var c_data = city_s_setting.dataAdapter(value.RelayServer);
								var path = _this.projection(cityPosition[value.City])
								var content = <Antd.Table size="small" columns={city_s_setting.columns} 
										dataSource={city_s_setting.getData(value.RelayServer)}
										pagination={false} bordered/>
								var fillColor = _this.setCityIconColor(c_data);	
								//console.debug(fillColor)
								return (
									<Antd.Popover key={ key } overlay={content} title={value.City} trigger="hover">	
										<circle onClick={ _this.showData(key) } title={value.City} key={ key } cx={path[0]} cy={path[1]} 
												r="5" stroke="#006600i" fill={fillColor}/>
									</Antd.Popover> 
								)
							})	
						}
					</g>
				</svg>
			)
		}else{
			return (
				<div></div>
			)
		}
        
    }
}

module.exports = ChinaMap 