function withOpacityValue(variable) {
	return ({ opacityValue }) => {
		if (opacityValue === undefined) {
			return `rgb(var(${variable}))`;
		}
		return `rgb(var(${variable}) / ${opacityValue})`;
	};
}

module.exports = {
	darkMode: "class",
	content: [
		"./app.vue",
		"./components/**/*.{vue,js}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
	],
	darkMode: "media",
	theme: {
		extend: {
			colors: {
				aqua: "var(--color-aqua)",
				blue: "var(--color-blue)",
				"bright-red": "var(--color-bright-red)",
				brown: "var(--color-brown)",
				burgundy: "var(--color-burgundy)",
				coral: "var(--color-coral)",
				copper: "var(--color-copper)",
				cornflower: "var(--color-cornflower)",
				"flat-gold": "var(--color-flat-gold)",
				"fluorescent-orange": "var(--color-fluorescent-orange)",
				"fluorescent-pink": "var(--color-fluorescent-pink)",
				"fluorescent-red": "var(--color-fluorescent-red)",
				"fluorescent-yellow": "var(--color-fluorescent-yellow)",
				green: "var(--color-green)",
				"kelly-green": "var(--color-kelly-green)",
				"light-gray": "var(--color-light-gray)",
				"light-teal": "var(--color-light-teal)",
				"metallic-gold": "var(--color-metallic-gold)",
				mint: "var(--color-mint)",
				moss: "var(--color-moss)",
				orange: "var(--color-orange)",
				orchid: "var(--color-orchid)",
				purple: "var(--color-purple)",
				red: "var(--color-red)",
				"risofederal-blue": "var(--color-risofederal-blue)",
				scarlet: "var(--color-scarlet)",
				sunflower: "var(--color-sunflower)",
				yellow: "var(--color-yellow)",
				natural: "var(--color-natural)",
				white: "var(--color-white)",
				"dark-less": "#363636",
				dark: "#232323",
				darker: "#202020",
				darkest: "#121212",
			},
			lineHeight: {
				12: "3rem",
			},
		},
		fontFamily: {
			serif: ["Inknut Antiqua", "serif"],
			sans: ["DM Mono", "sans-serif"],
			mono: ["DM Mono", "sans-serif"],
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
