export type LocationData = {
	name: string;
	states: {
		name: string;
		cities: string[];
	}[];
};

export const locations: LocationData[] = [
	{
		name: 'United Arab Emirates',
		states: [
			{ name: 'Abu Dhabi', cities: ['Abu Dhabi', 'Al Ain', 'Madinat Zayed'] },
			{ name: 'Dubai', cities: ['Dubai', 'Hatta'] },
			{ name: 'Sharjah', cities: ['Sharjah', 'Khor Fakkan'] },
		],
	},
	{
		name: 'United States',
		states: [
			{ name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
			{ name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester'] },
			{ name: 'Texas', cities: ['Houston', 'Dallas', 'Austin'] },
		],
	},
	{
		name: 'India',
		states: [
			{ name: 'Delhi', cities: ['New Delhi', 'Dwarka', 'Saket'] },
			{ name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur'] },
			{ name: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Mangaluru'] },
		],
	},
];


