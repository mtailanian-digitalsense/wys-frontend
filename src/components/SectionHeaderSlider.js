import React, { Component } from 'react';
export default class SectionHeaderSlider extends Component {
	render() {
		return (
			<div className={"section-header-slider " + this.props.section}>
				<div className="section-header-slider-buttons">
					{this.props.options.map((o, i) => {
						//return <Link key={o} to={o}><div className={"section-header-slider-button"+(o===this.props.selectedOption?" active":"")} /></Link>
						return <div 
							key={i} 
							className={
								"section-header-slider-button"
								+(o===this.props.selectedOption?" active":"")} />

					})}
				</div>
			</div>
		);
	}
}
