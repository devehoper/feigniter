const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

// Define available components
const widgets = ['Modal', 'Tooltip', 'Carousel', 'Tabs', 'Dropdown'];
const services = [
  'stripeService',
  'paypalService',
  'mbwayService',
  'certifiedInvoiceService',
  'manualInvoiceService',
  'authService',
  'twoFactorService',
  'paymentDispatcher',
  'invoiceManager'
];

// Prompt user
inquirer.prompt([
  {
    type: 'checkbox',
    name: 'selectedWidgets',
    message: 'Select widgets to include:',
    choices: widgets
  },
  {
    type: 'checkbox',
    name: 'selectedServices',
    message: 'Select services to include:',
    choices: services
  }
]).then(({ selectedWidgets, selectedServices }) => {
  // Remove unselected widgets
  widgets.forEach(widget => {
    if (!selectedWidgets.includes(widget)) {
      const widgetPath = path.join(__dirname, 'src/widgets', widget);
      fs.removeSync(widgetPath);
    }
  });

  // Remove unselected services
  services.forEach(service => {
    if (!selectedServices.includes(service)) {
      const servicePath = path.join(__dirname, 'src/services', `${service}.js`);
      fs.removeSync(servicePath);
    }
  });

  // Regenerate services/index.js
  const imports = selectedServices.map(s => `import ${s} from './${s}.js';`).join('\n');
  const exports = `export default {\n  ${selectedServices.join(',\n  ')}\n};`;

  fs.writeFileSync(path.join(__dirname, 'src/services', 'index.js'), `${imports}\n\n${exports}`);
});
