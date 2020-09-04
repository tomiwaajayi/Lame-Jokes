import React, { Component } from 'react';
import './JokeList.css';
import Joke from './Joke';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

class JokeList extends Component {
	static defaultProps = {
		numberOfJokesToGet: 10,
	};
	constructor(props) {
		super(props);
		this.state = {
			jokes: JSON.parse(window.localStorage.getItem('jokes')) || [],
			loading: false,
		};

		this.seenJokes = new Set(this.state.jokes.map((j) => j.text));
		console.log(this.seenJokes);
	}

	componentDidMount() {
		if (this.state.jokes.length === 0) {
			this.getJokes();
		}
	}

	async getJokes() {
		try {
			let jokes = [];
			while (jokes.length < this.props.numberOfJokesToGet) {
				let res = await axios.get('https://icanhazdadjoke.com', {
					headers: { Accept: 'application/json' },
				});
				if (!this.seenJokes.has(res.data.joke)) {
					jokes.push({ text: res.data.joke, votes: 0, id: uuid() });
				} else {
					console.log('Duplicate Found');
				}
			}

			this.setState(
				(st) => ({
					jokes: [...st.jokes, ...jokes],
					loading: false,
				}),
				() =>
					window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
			);
		} catch (e) {
			alert(e);
		}
	}

	// console.log(this.state);

	handleVote = (id, delta) => {
		this.setState(
			(st) => ({
				jokes: st.jokes.map((joke) =>
					joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
				),
			}),
			() =>
				window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
		);
	};

	handleClick = () => {
		this.setState({ loading: true }, this.getJokes);
	};

	render() {
		if (this.state.loading) {
			return (
				<div>
					<div className="multi-spinner-container">
						<div class="multi-spinner">
							<div class="multi-spinner">
								<div class="multi-spinner">
									<div class="multi-spinner">
										<div class="multi-spinner">
											<div class="multi-spinner"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<h1>Loading...</h1>
				</div>
			);
		}
		let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
		return (
			<div className="JokeList">
				<div className="JokeList-sidebar">
					<h1 className="JokeList-title">
						<span>Lame</span> Jokes
					</h1>
					<img
						src="https://images.vexels.com/media/users/3/143943/isolated/preview/3944b394d58276efe1668c3006104904-evil-face-emoji-by-vexels.png"
						alt="emoji"
					/>
					<button
						className="JokeList-get-more-jokes"
						onClick={this.handleClick}
					>
						New jokes
					</button>
				</div>

				<div className="JokeList-jokes">
					{jokes.map((j) => (
						<Joke
							key={j.id}
							id={j.id}
							handleVote={this.handleVote}
							text={j.text}
							votes={j.votes}
						/>
					))}
				</div>
			</div>
		);
	}
}

export default JokeList;
