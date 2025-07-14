export interface Role {
	id: string;
	label: string;
}

export type RolesType = Record<string, Role[]>;

const Roles: RolesType = {
	Business: [
		{
			id: "chief_technology_officer",
			label: "Chief Product/Technology Officer",
		},
		{ id: "chief_learning_officer", label: "Chief Learning Officer" },
		{ id: "chief_people_officer", label: "Chief People Officer" },
		{ id: "chief_customer_officer", label: "Chief Customer Officer" },
		{ id: "vp_training", label: "VP of Training" },
		{ id: "vp_hr", label: "VP of Human Resources" },
		{ id: "dir_talend_dev", label: "Director of Talent Development" },
		{ id: "training_manager", label: "Training & Development Manager" },
		{ id: "dir_lnd", label: "Director of Learning & Development" },
		{ id: "dir_od", label: "Director of Organizational Development" },
		{ id: "head_of_learning", label: "Head of Learning" },
		{ id: "prod_mgr", label: "Product Manager" },
		{ id: "instructional_designer_biz", label: "Instructional Designer" },
		{ id: "dir_product", label: "Director of Product Management" },
		{ id: "dir_cust_training", label: "Director of Customer Training" },
		{ id: "other_biz", label: "Other" },
	],
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
