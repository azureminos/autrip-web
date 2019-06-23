import React, { Component, createElement } from 'react';
import styled from 'styled-components';
import { ButtonContainer } from './Button';
import { Link } from 'react-router-dom';

export default class Modal extends Component {
	render () {
		const { modalOpen, closeModal } = this.props;
		const { imageUrl, name, startingRate } = this.props.modalProduct;

		const ModalContainer = styled.div`
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.3);
			display: flex;
			align-items: center;
			justify-content: center;
			#modal {
				background: var(--mainWhite);
			}
		`;

		if (!modalOpen) {
			return null;
		}
		return (
			<ModalContainer>
				<div className="container">
					<div className="row">
						<div
							className="col-8 mx-auto col-md-6 col-lg-4 p-5 text-center text-capitalize"
							id="modal"
						>
							<h5>item added to cart</h5>
							<img src={imageUrl} className="img-fluid" alt="" />
							<h5>{name}</h5>
							<h5 className="text-muted">price : ${startingRate}</h5>
							<Link to="/">
								<ButtonContainer
									onClick={() => {
										closeModal();
									}}
								>
									Continue Shopping
								</ButtonContainer>
							</Link>
							<Link to="/cart">
								<ButtonContainer
									cart
									onClick={() => {
										closeModal();
									}}
								>
									Go To Cart
								</ButtonContainer>
							</Link>
						</div>
					</div>
				</div>
			</ModalContainer>
		);
	}
}
