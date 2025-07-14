export interface Role {
	id: string;
	label: string;
}

export type RolesType = Record<string, Role[]>;

const Roles: RolesType = {
	Business: [],
	Government: [],
	"Higher Education": [
		{
			id: "instructor",
			label: "Faculty / Instructor",
		},
		{
			id: "instructional_designer",
			label: "Instructional Designer",
		},
	],
	"K-12 & Primary": [
		{
			id: "teacher",
			label: "Teacher",
		},
		{
			id: "tech_coach",
			label: "Technology Coach",
		},
		{
			id: "principal",
			label: "Principal",
		},
		{
			id: "superintendent",
			label: "Superintendent",
		},
		{
			id: "school_board",
			label: "School Board Member",
		},
		{
			id: "librarian",
			label: "Librarian",
		},
	],
	Other: [
		{
			id: "other",
			label: "Other",
		},
	],
	"Technical & Vocational": [],
};
export default Roles;
