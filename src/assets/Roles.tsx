export interface Role {
	id: string;
	label: string;
}

export type RolesType = Record<string, Role[]>;

type RolesRawType = {
	[key: string]: string[];
};

const RolesRaw: RolesRawType = {
	Business: [
		"Chief Product/Technology Officer",
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
		"Other",
	],
	Government: [],
	"Higher Education": ["Faculty / Instructor", "Instructional Designer"],
	"K-12 & Primary": [
		"Teacher",
		"Technology Coach",
		"Principal",
		"Superintendent",
		"School Board Member",
		"Librarian",
	],
	Other: ["Other"],
	"Technical & Vocational": [],
};

const Roles: RolesType = Object.fromEntries(
	Object.entries(RolesRaw).map(([category, roles]) => [
		category,
		roles.map((role) => ({
			id: `${category}_${role}`.toLowerCase().replace(/[^a-z0-9]/g, "_"),
			label: role,
		})),
	]),
);

export default Roles;
