export interface Role {
	id: string;
	label: string;
}

export type RolesType = Record<string, Role[]>;

type RolesRawType = {
	[key: string]: string[];
};

// biome-ignore assist/source/useSortedKeys: RoleSelect order is static.
const RolesRaw: RolesRawType = {
	"Higher Education": [
		"Faculty / Instructor",
		"Instructional Designer",
		"Academic Technologist",
		"LMS Administrator",
		"Director of Online Learning",
		"Center for Teaching & Learning Director",
		"Vice President of Teaching & Learning",
		"Dean / Associate Dean",
		"Learning Technologist",
		"Department Chair",
		"Academic Program Coordinator",
		"Provost / Associate Provost",
		"Online Learning Coordinator",
		"Assessment Coordinator",
		"Director of Digital Education",
		"Registrar",
		"Academic Advisor",
		"IT Administrator",
	],
	"K-12 & Primary": [
		"Teacher",
		"Technology Coach",
		"Instructional Coach",
		"Principal / Assistant Principal",
		"Curriculum Coordinator",
		"Team Lead",
		"IT Director",
		"Superintendent",
		"School Board Member",
		"Librarian",
		"Assessment Coordinator",
		"Professional Development Coordinator",
	],
	"Technical & Vocational": [
		"Instructional Technologist",
		"LMS Administrator",
		"Curriculum / Instructional Designer",
		"Career & Technical Education Coordinator",
		"IT Systems Specialist",
		"Workforce Development Manager",
		"Data & Learning Analytics Specialist",
		"Training Coordinator",
		"Program Manager",
	],
	Business: [
		"Chief Product / Technology Officer",
		"Chief Learning Officer",
		"Chief People Officer",
		"Chief Customer Officer",
		"VP of Training",
		"VP of Human Resources",
		"Director of Talent Development",
		"Training & Development Manager",
		"Director of Learning & Development",
		"Director of Organizational Development",
		"Head of Learning",
		"Product Manager",
		"Instructional Designer",
		"Director of Product Management",
		"Director of Customer Training",
	],
	Government: [
		"Training & Development Manager",
		"Organizational Development Specialist",
		"Workforce Learning Director",
		"Public Safety Training Officer",
		"Digital Services Officer",
		"Departmental Training Coordinator",
		"Enterprise Systems Trainer",
	],
	Other: [],
} as const;

const Roles: RolesType = Object.fromEntries(
	Object.entries(RolesRaw).map(([category, roles]) => [
		category,
		roles
			.slice()
			.sort((a, b) => a.localeCompare(b))
			.concat("Other")
			.map((role) => ({
				id: `${category}_${role}`.toLowerCase().replace(/[^a-z0-9]/g, "_"),
				label: role,
			})),
	]),
);

export default Roles;
