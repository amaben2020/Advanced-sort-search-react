import { BiArchive } from "react-icons/bi";
import Search from "./components/Search";
import AppointmentInfo from "./components/AppointmentInfo";
import AppointmentForm from "./components/AppointmentForm";
import { useState, useEffect, useCallback } from "react";
import ReactPaginate from "react-paginate";
function App() {
	let [toggle, setToggle] = useState(false);
	let [sortToggle, setSortToggle] = useState(false);
	let [appointmentData, setAppointmentData] = useState([]);
	//Query is the state that stores what you type
	let [query, setQuery] = useState("");
	//sorting states based on the keys in the data
	let [sortBy, setSortBy] = useState("petName");
	let [orderBy, setOrderBy] = useState("asc");

	//////////////////////////////////////////////
	/// PAGINATION LOGIC VERY EASY
	//The pagination state
	const [pageNumber, setPageNumber] = useState(0);

	//The pagination state appointmentData per page
	const appointmentDataPerPage = 5;

	// i.e 0 * 5
	const pagesVisited = pageNumber * appointmentDataPerPage;

	const displayNumberOfAppointmentData = appointmentData
		.slice(pagesVisited, pagesVisited + appointmentDataPerPage)
		.map((appointment) => {
			return (
				<div>
					<h3> {appointment.aptNotes}</h3>
					<h3> {appointment.ownerName}</h3>
					<h3> {appointment.petName}</h3>
				</div>
			);
		});
	console.log("display: ", displayNumberOfAppointmentData);
	console.log("appointment data", appointmentData);
	// PAGINATION ENDS
	/////////////////////////

	const toggler = () => {
		setToggle(!toggle);
	};

	//conditional rendering for the sort dropdown
	const sortToggler = () => {
		setSortToggle(!sortToggle);
	};

	const fetchData = useCallback(() => {
		fetch("./appointmentsData.json")
			.then((res) => res.json())
			.then((data) => setAppointmentData(data))
			.catch((error) => console.log(error));
	}, []);
	///////////////////////////////////////////////////////////////
	//Very simple sorted array
	// const sortedArray = numbers.sort((a, b) => {
	// 	const first = a.name.toLowerCase();
	// 	const last = b.name.toLowerCase();
	// 	return first < last ? -1 : null;
	// });
	///////////////////////////////////////////////////////////////

	//filter the array based on its keys and the user input
	const filteredAppointments = appointmentData
		.filter((item) => {
			//filter simply extracts based on the 3 query values inserted in the search
			return (
				item.petName.toLowerCase().includes(query.toLowerCase()) ||
				item.aptNotes.toLowerCase().includes(query.toLowerCase()) ||
				item.ownerName.toLowerCase().includes(query.toLowerCase())
			);
		})
		//chain the sort fn to it
		.sort((a, b) => {
			//order is a variable that ordersBy higher first value
			let order = orderBy === "asc" ? 1 : -1;
			return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
				? -1 * order
				: 1 * order;
		}) //getting only 5 appointment data per page
		.slice(pagesVisited, pagesVisited + appointmentDataPerPage);

	//Creating the changePageCount function that creates the btns needed
	//i.e 50 / 5 = 10btns [5] [10] [15] [20] [25]
	const pageCount = Math.ceil(appointmentData.length / appointmentDataPerPage);

	// This function simply sets the pageNumber value to the selected button
	//i.e setPageNumber = 5; if there is 5 pageCount
	const changePage = ({ selected }) => {
		setPageNumber(selected);
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div className="App container mx-auto mt-6 font-thin">
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
				onSortByChange={(inputDataToBeSorted) => setSortBy(inputDataToBeSorted)}
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
			<ReactPaginate
				previousLabel={"Previous"}
				nextLabel={"Next"}
				pageCount={pageCount}
				onPageChange={changePage}
				containerClassName={"paginationBtns"}
				previousLinkClassName={"previousBtns"}
				nextLinkClassName={"nextBtns"}
				disabledClassName={"paginationDisabled"}
				activeClassName={"paginationActive"}
			/>
			{/* {displayNumberOfAppointmentData} */}
		</div>
	);
}

export default App;
