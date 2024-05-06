import fs from "fs";

import { hierarchy, Leaf, Node } from "fs-hierarchy";

const reI = "\\s*([+-]?\\d+)\\s*",
  reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
  reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
const reTokenStart = "(?:[\"'`:\\s]\\s*)";
const reTokenEnd = "(?:\\s*[\"'`;\\s])(?!\\s*[|:])";

const Colors = {
  reHex: "#[0-9a-f]{3,8}",
  reRgbInteger: `rgb\\(${reI},${reI},${reI}\\)`,
  reRgbPercent: `rgb\\(${reP},${reP},${reP}\\)`,
  reRgbaInteger: `rgba\\(${reI},${reI},${reI},${reN}\\)`,
  reRgbaPercent: `rgba\\(${reP},${reP},${reP},${reN}\\)`,
  reHslPercent: `hsl\\(${reN},${reP},${reP}\\)`,
  reHslaPercent: `hsla\\(${reN},${reP},${reP},${reN}\\)`,
};

const WEB_COLORS = [
  "transparent",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkgrey",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkslategrey",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dimgrey",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "greenyellow",
  "grey",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightgrey",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightslategrey",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "slategrey",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen",
];

const Matcher = `${reTokenStart}(?<color>${[...Object.values(Colors), ...WEB_COLORS].join("|")})${reTokenEnd}`;
const regex = new RegExp(Matcher, "gi");

const tree = hierarchy("..", {
  filter: {
    match: [
      "*.{js,jsx,ts,tsx,css,scss}",
      "!**/node_modules/**/*",
      "!**/dist/**/*",
      "!**/build/**/*",
      "!**/public/**/*",
      "!**/static/**/*",
      "!**/storybook-static/**/*",
      "!**/html/**/*",
    ],
    rule: "all",
    empty: false,
  },
  include: { pathname: true, type: true },
  flatten: true,
});

function readFileLineByLine(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
  } catch (e) {
    console.error("File Error", filePath, e);
    return [];
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");

  return fileContent.split("\n");
}

function findColors(files: Array<Leaf | Node>) {
  const found = {};
  const fileMap = {};

  function processFile(filePath) {
    const lines = readFileLineByLine(filePath);

    for (let lineNumber = 0, color; lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber];

      while ((color = regex.exec(line)?.groups?.color.toLowerCase())) {
        if (!found[color]) {
          found[color] = [];
        }
        if (!fileMap[filePath]) {
          fileMap[filePath] = 0;
        }

        found[color].push({
          path: filePath.replace(
            "/Users/fooloo/projects/ninox/packages/ninox-client/",
            ""
          ),
          line: lineNumber + 1,
        });
        fileMap[filePath]++;
      }
    }
  }

  files.forEach((file) => {
    console.log("Processing", file.path);
    processFile(file.path);
  });

  console.log(Object.keys(fileMap).length, "different files");
  return found;
}

function generateColorTable(findings) {
  const colors = Object.keys(findings).sort();
  let table = "<table>";
  table += "<tr>";
  table += "<th>Value</th>";
  table += "<th>File Path and Line Number</th>";
  table += "</tr>";

  for (const color of colors) {
    table += "<tr>";
    table += `<td>${color}</td>`;
    table += "<td>";
    table += "<table>";

    findings[color].forEach(({ path, line }) => {
      table += "<tr>";
      table += `<td>${path}</td>`;
      table += `<td>${line}</td>`;
      table += "</tr>";
    });

    table += "</table>";
    table += "</td>";
    table += "</tr>";
  }

  table += "</table>";

  return table;
}

function generateTransformationTable(findings) {
  const colors = Object.keys(findings).sort();
  let table = "<table>";
  table += "<tr>";
  table += "<th>Value</th>";
  table += "<th>Findings</th>";
  table += "<th>New Value</th>";
  table += "</tr>";

  for (const color of colors) {
    table += "<tr>";
    table += `<td>${color}</td>`;
    table += `<td>${findings[color].length}</td>`;
    table += "<td>";
    table += "</td>";
    table += "</tr>";
  }

  table += "</table>";

  return table;
}

const colorOccurrences = findColors((tree as Node).children);

if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

fs.writeFileSync(
  "dist/color-lookup.html",
  generateColorTable(colorOccurrences)
);
fs.writeFileSync(
  "dist/color-transform.html",
  generateTransformationTable(colorOccurrences)
);
fs.writeFileSync(
  "dist/color-lookup.json",
  JSON.stringify(colorOccurrences, null, 2)
);
fs.writeFileSync(
  "dist/colors.json",
  JSON.stringify(Object.keys(colorOccurrences), null, 2)
);

console.log(Object.keys(colorOccurrences).length, "different colors");
console.log(
  Object.keys(colorOccurrences).reduce((acc, current) => {
    return acc + colorOccurrences[current].length;
  }, 0),
  "matches"
);
