// widgets.js
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

const widgets = ['Modal', 'Tooltip', 'Carousel', 'Tabs', 'Dropdown'];

inquirer.prompt([
  {
    type: 'checkbox',
    name: 'selected',
    message: 'Select widgets to include:',
    choices: widgets
  }
]).then(({ selected }) => {
  widgets.forEach(comp => {
    if (!selected.includes(comp)) {
      const compPath = path.join(__dirname, 'src/widgets', comp);
      fs.removeSync(compPath);
      console.log(`Removed ${comp}`);
    }
  });
});
