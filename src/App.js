import { useEffect, useState, useRef } from "react";
import "./App.css";
const initializeGrid = () => {
	var arr = [];
	for (let i = 0; i < 264; i++) {
		if (i < 12 || i % 12 === 0 || i % 12 === 11 || i > 251) arr.push(2);
		else arr.push(null);
	}
	return arr;
};
const produceObstacle = () => {
	let randx = Math.floor(Math.random() * 6);
	let obstacle =
		randx % 6 === 0
			? [
					[4, -4],
					[4, -3],
					[4, -2],
					[4, -1],
			  ] //I
			: randx % 6 === 1
			? [
					[4, -2],
					[4, -1],
					[3, -1],
					[5, -1],
			  ] //+
			: randx % 6 === 2
			? [
					[4, -3],
					[4, -2],
					[4, -1],
					[5, -1],
			  ] //L
			: randx % 6 == 3
			? [
					[4, -2],
					[5, -2],
					[4, -1],
					[5, -1],
			  ] //kare
			: randx % 6 == 4
			? [
					[4, -3],
					[4, -2],
					[4, -1],
					[3, -1],
			  ] //ters L
			: [
					[5, -3],
					[5, -2],
					[4, -2],
					[4, -1],
			  ]; //S
	return obstacle;
};
const intToGrid = (x) => {
	return [x % 12, Math.floor(x / 12)];
};
const gridToInt = (arr) => {
	return arr[0] + arr[1] * 12;
};
const gridToIntArr = (arr) => {
	return arr.map((a) => a[0] + a[1] * 12);
};
function App() {
	const trans = (gArr) => {
		let arr = [...gArr];
		if (
			arr[0][1] === arr[1][1] &&
			arr[2][1] === arr[3][1] &&
			arr[0][0] === arr[2][0]
		)
			return;
		let dif = [];
		for (let i = 0; i < 4; i++)
			dif.push([arr[i][0] - arr[1][0], arr[i][1] - arr[1][1]]);
		dif.map((difx) => {
			let gecici = difx[1];
			difx[1] = difx[0];
			difx[0] = gecici * -1;
			return difx;
		});
		let base = [...arr[1]];
		let returnedArr = dif.map((d) => [d[0] + base[0], d[1] + base[1]]);
		let intReturnedArr = gridToIntArr(returnedArr);
		let xCoordinates = returnedArr.map((cell) => cell[0]);
		let rightXCoordinate = Math.max(...xCoordinates);
		let leftXCoordinate = Math.min(...xCoordinates);
		if (
			rightXCoordinate <= 10 &&
			leftXCoordinate >= 1 &&
			!intReturnedArr.some((i) => grid[i] === 1)
		)
			setObstacle(returnedArr);
	};
	const lefted = (gArr) => {
		let arr = [...gArr];
		arr.map((a) => a[0]--);
		setObstacle(arr);
	};
	const righted = (gArr) => {
		let arr = [...gArr];
		arr.map((a) => a[0]++);
		setObstacle(arr);
	};
	const downed = (gArr) => {
		let arr = [...gArr];
		arr.map((a) => a[1]++);
		setObstacle(arr);
	};
	const keyPress = (e) => {
		if (!isRunning) return;
		if (e.key == "ArrowUp") {
			if (e.repeat) return;
			trans(obstacle);
		} else if (e.key == "ArrowRight") {
			let xCoordinates = obstacle.map((cell) => cell[0]);
			let rightXCoordinate = Math.max(...xCoordinates);
			let intObstacle = gridToIntArr(obstacle);
			if (rightXCoordinate <= 9 && !intObstacle.some((i) => grid[i + 1] === 1))
				righted(obstacle);
		} else if (e.key == "ArrowLeft") {
			let xCoordinates = obstacle.map((cell) => cell[0]);
			let leftXCoordinate = Math.min(...xCoordinates);
			let intObstacle = [...gridToIntArr(obstacle)];
			if (leftXCoordinate >= 2 && !intObstacle.some((i) => grid[i - 1] === 1)) {
				lefted(obstacle);
			}
		} else if (e.key == "ArrowDown") {
			let intObstacle = gridToIntArr(obstacle);
			if (
				!(
					intObstacle.some((i) => grid[i] === 1) ||
					intObstacle.some((i) => grid[i] === 2)
				)
			)
				downed(obstacle);
		}
	};
	const [grid, setGrid] = useState(initializeGrid());
	const [obstacle, setObstacle] = useState(produceObstacle());
	const [time, setTime] = useState(0);
	const [changeTime, setChangeTime] = useState(0);
	const [isRunning, setIsRunning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);
	const [score, setScore] = useState(0);
	const [pace, setPace] = useState(400);
	const intervalRef1 = useRef();
	const intervalRef2 = useRef();
	useEffect(() => {
		intervalRef2.current = setInterval(
			() => setChangeTime((prev) => prev + 1),
			100
		);
	}, []);
	useEffect(() => {
		if (score % 10 === 5) setPace((prev) => prev * 0.9);
	}, [score]);
	useEffect(() => {
		if (isRunning)
			intervalRef1.current = setInterval(
				() => setTime((prev) => prev + 1),
				pace
			);
		else clearInterval(intervalRef1.current);
		return () => {
			clearInterval(intervalRef1.current);
		};
	}, [isRunning, pace]);
	useEffect(() => {
		setObstacle((prev) => {
			let arr = [...prev];
			arr.map((o) => {
				o[1]++;
				return o;
			});
			return arr;
		});
	}, [time]);
	useEffect(() => {
		if (isEnd) {
			clearInterval(intervalRef2.current);
			setIsRunning(false);
		}
	}, [isEnd]);
	useEffect(() => {
		window.addEventListener("keydown", keyPress);
		let firstLine = grid.slice(0, 12);
		if (firstLine.some((f) => f === 1)) setIsEnd(true);
		return () => {
			window.removeEventListener("keydown", keyPress);
		};
	}, [changeTime]);
	useEffect(() => {
		let firstLine = grid.slice(0, 12);
		if (!firstLine.some((f) => f === 1)) {
			let intObstacle = obstacle.map((o) => gridToInt(o));
			if (
				(intObstacle.some((i) => grid[i] === 2) && intObstacle[0] > 50) ||
				intObstacle.some((i) => grid[i] === 1)
			) {
				let uppedIntObstacle = intObstacle.map((i) => i - 12);
				setObstacle(produceObstacle());
				setScore((prev) => prev + 1);
				setGrid((prev) => {
					let arr = [...prev];
					for (let i of uppedIntObstacle) arr[i] = 1;
					return arr;
				});
			}
		}
	}, [obstacle]);
	useEffect(() => {
		let counts = [];
		let c;
		for (var i = 13; i <= 241; i += 12) {
			c = 0;
			for (let j = 0; j < 10; j++) {
				grid[i + j] === 1 ? c++ : (c = c);
			}
			counts.push(c);
		}
		let deletedIndexes = [];
		for (let i = 0; i < counts.length; i++) {
			if (counts[i] === 10) deletedIndexes.push(i);
		}
		if (deletedIndexes.length > 0)
			setGrid((prev) => {
				let arr = [...prev];
				if (deletedIndexes.length > 1) {
					for (let i = deletedIndexes.length - 1; i > 0; i--) {
						let count = 0;
						for (
							let j = (deletedIndexes[i] + 2) * 12;
							j > (deletedIndexes[i - 1] + 1) * 12;
							j--
						) {
							count++;
							if (count <= 12 && arr[j] === 1) {
								arr[j] = 0;
							} else {
								if (arr[j] === 1) {
									arr[j] = 0;
									arr[j + 12] = 1;
								}
							}
						}
					}
				}
				if (deletedIndexes.length > 0) {
					let c = 0;
					for (let j = (deletedIndexes[0] + 2) * 12; j > 0; j--) {
						c++;
						if (c <= 12 && arr[j] === 1) {
							arr[j] = 0;
						} else {
							if (arr[j] === 1) {
								arr[j] = 0;
								arr[j + 12] = 1;
							}
						}
					}
				}

				return arr;
			});
	}, [grid]);
	const pause = () => {
		setIsRunning(false);
	};
	const resume = () => {
		setIsRunning(true);
	};
	const replay = () => {
		setIsEnd(false);
		setIsRunning(true);
		intervalRef2.current = setInterval(
			() => setChangeTime((prev) => prev + 1),
			100
		);
		setGrid(initializeGrid());
		setScore(0);
		setPace(400);
	};
	return (
		<div>
			<div className="grid-container">
				{grid.map((cell, index) => (
					<div
						className={
							cell == 2
								? "grid-item wall"
								: cell == 1
								? "grid-item addedObstacle"
								: gridToIntArr(obstacle).some((x) => x === index)
								? "grid-item obstacle"
								: "grid-item"
						}
					></div>
				))}
			</div>
			<button onClick={pause}>Pause</button>
			<button onClick={resume}>Resume</button>
			<button onClick={replay}>Replay</button>
			<div>{score}</div>
		</div>
	);
}

export default App;
