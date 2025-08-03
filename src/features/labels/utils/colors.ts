export function rgbToHex(r: number, g: number, b: number) {
    function conv(c: number) {
        return c.toString(16).padStart(2, "0");
    }
    return `#${conv(r)}${conv(g)}${conv(b)}`;
}

export function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : {
              r: 0,
              g: 0,
              b: 0,
          };
}

export function isDark(color: string) {
    const rgb = parseInt(
        color.slice(color.indexOf("#") + 1, color.indexOf("#") + 7),
        16
    );
    const luma =
        0.2126 * ((rgb >> 16) & 0xff) +
        0.7152 * ((rgb >> 8) & 0xff) +
        0.0722 * ((rgb >> 0) & 0xff);
    return luma < 156;
}

export function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
