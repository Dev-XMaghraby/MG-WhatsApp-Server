const fs = require('fs');
const path = require('path');

try {
    fs.cpSync(path.resolve(__dirname, "../static/"), path.resolve(__dirname, '../dist/static/'), {recursive: true});
} catch (error) {
    console.error(error);
    
}