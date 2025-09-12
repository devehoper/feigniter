// setup.js
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

const components = ['Modal', 'Tooltip', 'Carousel', 'Tabs', 'Dropdown'];

inquirer.prompt([
  {
    type: 'checkbox',
    name: 'selected',
    message: 'Select components to include:',
    choices: components
  }
]).then(({ selected }) => {
  components.forEach(comp => {
    if (!selected.includes(comp)) {
      const compPath = path.join(__dirname, 'src/components', comp);
      fs.removeSync(compPath);
      console.log(`Removed ${comp}`);
    }
  });
});
