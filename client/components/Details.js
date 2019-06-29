import React, { Component, createElement } from 'react';
import { ButtonContainer } from './Button';
import { Link } from 'react-router-dom';

export default class Details extends Component {
	render () {
		const { addToCart, openModal } = this.props;
		const {
			id,
			imageUrl,
			description,
			startingRate,
			name,
			inCart,
		} = this.props.product;

		return (
			<div className="container py-5">
				{/* title */}
				<div className="row">
					<div className="col-10 mx-auto text-center text-slanted text-blue my-5">
						<h1>{name}</h1>
					</div>
				</div>
				{/* end of title */}
				<div className="row">
					<div className="col-10 mx-auto col-md-6 my-3">
						<img src={imageUrl} className="img-fluid" alt="" />
					</div>
					{/* prdoduct info */}
					<div className="col-10 mx-auto col-md-6 my-3 text-capitalize">
						<h1>{name}</h1>
						<h4 className="text-blue">
							<strong>
								price : <span>$</span>
								{startingRate}
							</strong>
						</h4>
						<p className="text-capitalize font-weight-bold mt-3 mb-0">
							some info about product :
						</p>
						<p className="text-muted lead">{description}</p>
						{/* buttons */}
						<div>
							<Link to="/">
								<ButtonContainer>back to products</ButtonContainer>
							</Link>
							<ButtonContainer
								cart
								disabled={inCart ? true : false}
								onClick={() => {
									addToCart(id);
									openModal(id);
								}}
							>
								{inCart ? 'in cart' : 'add to cart'}
							</ButtonContainer>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
