// write your code here
const fs = require("fs");
const crypto = require("crypto");
const readline = require("readline");
const stream = fs.createReadStream("./database.csv");
const reader = readline.createInterface({ input: stream });

let data = [];

reader.on("line", row => {
    data.push(row.split(", "));
});

reader.on("close", () => {
    let hashedData = data.map(line => {
        return [line[0], line[1], getHash(line[2]), line[3]].join(", ");
    });
    hashedData.splice(0, 1, data[0].join(", "));
    writeFile(hashedData, 'hash_database');

    let filterData = data.filter(line => {
        if (!line.includes("-")) {
            return line;
        }
    });

    filterData.forEach((line, index) => {
        if (index > 0) {
            line[0] = index.toString();
            line[2] = getHash(line[2]);
        }
        filterData[index] = filterData[index].join(", ")
    });
    writeFile(filterData, 'filtered_database');
});

function getHash(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
}

function writeFile(data, file) {
    fs.writeFile(`./${file}.csv`, data.join("\n"), (error) => {
        if (error) console.log(error);
    });
}

