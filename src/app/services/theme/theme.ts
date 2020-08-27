export interface Theme {
    name: string;
    properties: any;
}

export const light: Theme = {
    name: 'light',
    properties: {
        '--bg-color': 'hsl(0, 0%, 96%)',
        '--text-strong': 'hsl(0, 0%, 21%)',
        '--text-light': 'hsl(0, 0%, 48%)',
        '--text': 'hsl(0, 0%, 29%)',
        '--border': 'hsl(0, 0%, 86%)',
        '--border-hover': 'hsl(0, 0%, 71%)',

        '--text-primary': '#192c55',
        '--text-secondary': '#737474',
        '--bg-primary': 'hsl(0, 0%, 96%)',
        '--bg-secondary': '#e4e4e4',
        '--element-bg-color': '#f5f5f5',
        '--element-bg-color-secondary': '#fff',

        '--link-primary': '#56CFE1',
        '--link-secondary': '#48BFE3',

        '--inverse': 'hsl(0, 0%, 14%)',

        '--danger': 'hsl(348, 100%, 61%)',
        '--success': 'hsl(141, 71%, 48%)',
        '--primary': 'hsl(171, 100%, 41%)',
        '--info': 'hsl(204, 86%, 53%)',
        '--link': 'hsl(217, 71%, 53%)',
        '--warning': 'hsl(48, 100%, 67%)',
    }
  };

export const dark: Theme = {
    name: 'dark',
    properties: {
        '--bg-color': '#0f111a',
        '--text-strong': '#fff',
        '--text-light': 'hsl(0, 0%, 96%)',
        '--text': 'hsl(0, 0%, 29%)',
        '--border': 'hsl(0, 0%, 93%)',
        '--border-hover': 'hsl(0, 0%, 71%)',

        '--text-primary': '#b6b6b6',
        '--text-secondary': '#ececec',
        '--bg-primary': '#23232e',
        '--bg-secondary': '#0a0c12',
        '--element-bg-color': '#252b4b',
        '--element-bg-color-secondary': '#161b2e',

        '--link-primary': '#56CFE1',
        '--link-secondary': '#48BFE3',

        '--inverse': 'hsl(0, 0%, 96%)',

        '--danger': 'hsl(348, 86%, 43%)',
        '--success': 'hsl(141, 53%, 31%)',
        '--primary': 'hsl(171, 100%, 29%)',
        '--info': 'hsl(204, 71%, 39%)',
        '--link': 'hsl(217, 71%, 45%)',
        '--warning': 'hsl(48, 100%, 29%)',
    }
  };
