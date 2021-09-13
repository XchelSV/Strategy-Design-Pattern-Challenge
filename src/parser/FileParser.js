import fs from 'fs';
import path from 'path';

class FileParser { 
    constructor(filename){
        const lines = fs.readFileSync(`${path.resolve(path.dirname(''))}/${filename}`).toString().split("\n");
        this.lines = lines.map((line) => JSON.parse(line));
    }
}

export default FileParser;