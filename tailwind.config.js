/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./resources/js/**/*.vue', './resources/views/**/*.blade.php'],
    theme: {
        extend: {
            colors: {
                primary: { DEFAULT: '#7567CE', light: '#8172e0', dark: '#6456b8' },
                light: {
                    surface: {
                        background: '#F9FAFB',
                        primary: '#FFFFFF',
                        brand: {
                            DEFAULT: '#7567CE',
                            alpha: '#B2A4FF1A',
                        },
                    },
                    stroke: {
                        DEFAULT: '#E7E9EC',
                        strong: '#D7D8D9',
                    },
                    content: {
                        DEFAULT: '#5B5E68',
                        strong: '#1B1D27',
                        brand: '#7567CE',
                        selected: '#9281EF',
                    },
                    btn: {
                        background: {
                            DEFAULT: '#FFFFFF',
                            hover: '#9281EF',
                            brand: {
                                DEFAULT: '#7567CE',
                                hover: '#9281EF',
                            },
                        },
                    },
                },
                dark: {
                    surface: {
                        background: '#1B1D27',
                        primary: '#2A2C36',
                    },
                    stroke: {
                        DEFAULT: '#3A3C46',
                        strong: '#3A3C46',
                    },
                    content: {
                        DEFAULT: '#FFFFFF',
                        strong: '#FFFFFF',
                        brand: '#B2A4FF',
                        selected: '#9281EF',
                    },
                    btn: {
                        background: {
                            DEFAULT: '#FFFFFF',
                            hover: '#9281EF',
                            brand: {
                                DEFAULT: '#B2A4FF',
                                hover: '#9281EF',
                            },
                        },
                    },
                },
            },
            keyframes: {
                'fade-in': {
                    from: {
                        opacity: '0',
                    },
                    to: {
                        opacity: '1',
                    },
                },
                'fade-out': {
                    from: {
                        opacity: '1',
                    },
                    to: {
                        opacity: '0',
                    },
                },
                'slide-in': {
                    from: {
                        transform: 'translateX(-100%)',
                    },
                    to: {
                        transform: 'translateX(0)',
                    },
                },
                'slide-in-left': {
                    from: {
                        transform: 'translateX(100%)',
                    },
                    to: {
                        transform: 'translateX(0)',
                    },
                },
                'slide-out': {
                    from: {
                        transform: 'translateX(0)',
                    },
                    to: {
                        transform: 'translateX(100%)',
                    },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.2s ease-in',
                'fade-out': 'fade-out 0.2s ease-out',
                'slide-in': 'slide-in 0.2s ease-in',
                'slide-in-left': 'slide-in-left 0.2s ease-in',
                'slide-out': 'slide-out 0.2s ease-out',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
