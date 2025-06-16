export interface Role {
	id: string;
	label: string;
}
export type RoleCategory = string;

export type RolesType = Record<RoleCategory, Role[]>;

const Roles: RolesType = {
	Corporate: [],
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
	"K-12": [
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
};
export default Roles;
