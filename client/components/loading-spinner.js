import React from 'react';
import { css } from '@emotion/core';
// First way to import
import { HashLoader } from 'react-spinners';

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`;

class LoadingSpinner extends React.Component {
	render () {
		return (
			<div className="sweet-loading">
				<HashLoader
					css={override}
					sizeUnit={'px'}
					size={100}
					color={'#123abc'}
					loading={this.props.loading}
				/>
			</div>
		);
	}
}

export default LoadingSpinner;
