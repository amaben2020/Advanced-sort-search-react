import { BiArchive } from "react-icons/bi";
import Search from "./components/Search";
import AppointmentInfo from "./components/AppointmentInfo";
import AppointmentForm from "./components/AppointmentForm";
import { useState, useEffect, useCallback } from "react";

function App() {
	let [toggle, setToggle] = useState(false);
	let [sortToggle, setSortToggle] = useState(false);
	let [appointmentData, setAppointmentData] = useState([]);
	//Query is the state that stores what you type
	let [query, setQuery] = useState("");
	//sort based on the keys in the data
	let [sortBy, setSortBy] = useState("petName");
	let [orderBy, setOrderBy] = useState("asc");

	const toggler = () => {
		setToggle(!toggle);
	};

	//conditional rendering for the sort button
	const sortToggler = () => {
		setSortToggle(!sortToggle);
	};

	const fetchData = useCallback(() => {
		fetch("./appointmentsData.json")
			.then((res) => res.json())
			.then((data) => setAppointmentData(data))
			.catch((error) => console.log(error));
	}, []);

	//filter the array based on its keys and the user input
	const filteredAppointments = appointmentData
		.filter((item) => {
			console.log(appointmentData);
			return (
				item.petName.toLowerCase().includes(query.toLowerCase()) ||
				item.aptNotes.toLowerCase().includes(query.toLowerCase()) ||
				item.ownerName.toLowerCase().includes(query.toLowerCase())
			);
		})
		.sort((a, b) => {
			let order = orderBy === "asc" ? 1 : -1;
			return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
				? -1 * order
				: 1 * order;
		});
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div className="App container mx-auto mt-3 font-thin">
			<AppointmentForm
				toggler={toggler}
				toggle={toggle}
				setToggle={setToggle}
				onSendAppointment={(myAppointment) =>
					setAppointmentData([...appointmentData, myAppointment])
				}
				lastId={appointmentData.reduce(
					(max, item) => (Number(item.id) > max ? Number(item.id) : max),
					0
				)}
			/>
			<h1 className="text-5Xl">
				<BiArchive className="inline-block text-red-400" /> Pet Appointment 🐶{" "}
			</h1>
			<Search
				sortToggler={sortToggler}
				sortToggle={sortToggle}
				query={query}
				onQueryChange={(myQuery) => setQuery(myQuery)}
				orderBy={orderBy}
				onSortByChange={(mySort) => setSortBy(mySort)}
				onOrderByChange={(mySort) => setOrderBy(mySort)}
				sortBy={sortBy}
			/>
			<ul className="divide-y divide-gray-200">
				{filteredAppointments.map((appointment) => (
					<AppointmentInfo
						appointment={appointment}
						//deleting an appointment
						onDeleteAppointment={(appointmentId) =>
							setAppointmentData(
								appointmentData.filter(
									(appointment) => appointment.id !== appointmentId
								)
							)
						}
					/>
				))}
			</ul>
		</div>
	);
}

export default App;
