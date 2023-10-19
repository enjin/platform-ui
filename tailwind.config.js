/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./resources/js/**/*.vue', './resources/views/**/*.blade.php'],
    theme: {
        extend: {
            colors: {
                primary: { DEFAULT: '#7567CE', light: '#8172e0', dark: '#6456b8' },
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
