// Palette and fonts follow the personal site (static/style.css): navy + brass on warm paper.
module.exports = {
  content: ['../../root/courses/building-construction-ii/index.html', '../../root/courses/building-construction-ii/app.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"Segoe UI"', 'Tahoma', 'Arial', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', '"Noto Naskh Arabic"', 'serif'],
      },
      colors: {
        stone: { 50:'#faf8f3',100:'#f3efe6',200:'#e4dfd3',300:'#d3ccbb',400:'#9a9486',500:'#7a7466',600:'#5f6675',700:'#4a5465',800:'#2f3a4d',900:'#1b2433',950:'#13294b' },
        slate: { 50:'#f8f6f1',100:'#f3efe6',200:'#e4dfd3',300:'#d3ccbb',400:'#9a9486',500:'#5b6575',600:'#4a5465',700:'#2f3a4d',800:'#1f2a3d',900:'#1b2433',950:'#0f1622' },
        amber: { 50:'#faf5e8',100:'#f3ecdb',200:'#e8d9b3',300:'#d2b06a',400:'#d2b06a',500:'#bf9a45',600:'#a8822f',700:'#8a6a22',800:'#6f561c',900:'#4a3a15' },
        emerald: { 50:'#eef6f1',100:'#dcece3',200:'#bcdccb',300:'#9fd3b8',400:'#6fbf9b',500:'#3f9a76',600:'#2f7a5a',700:'#276650',800:'#1f5240',900:'#1c4a39' },
        red: { 50:'#fbefeb',100:'#f6e1da',200:'#efc9bd',300:'#e5a998',400:'#e08a73',500:'#c9654b',600:'#b5583a',700:'#94402a',800:'#7d3624',900:'#5e2a1c' },
        teal: { 50:'#eef4f9',100:'#dbe8f2',200:'#bcd3e6',300:'#8fb6d4',400:'#5c97c0',500:'#3d7fae',600:'#2c6a96',700:'#245a80',800:'#1f4a69',900:'#1b3d56' },
        orange: { 50:'#fbf1ea',100:'#f6e1d2',200:'#ecc5ab',300:'#e0a37f',400:'#d27f55',500:'#c26a3f',600:'#b5583a',700:'#94402a',800:'#7d3624',900:'#5e2a1c' },
      },
    },
  },
};
