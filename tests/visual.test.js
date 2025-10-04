const puppeteer = require('puppeteer');
const path = require('path');

describe('Visual Regression Tests', () => {
    let browser;
    let page;

    // Set a higher timeout for Puppeteer tests, as they can be slow.
    jest.setTimeout(30000);

    beforeAll(async () => {
        browser = await puppeteer.launch({
            // headless: false, // Uncomment to see the browser in action
            // slowMo: 50,     // Slows down Puppeteer operations by 50ms
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Header component should match the snapshot', async () => {
        try {
            // Navigate to your running application
            await page.goto('http://localhost/feigniter/', { waitUntil: 'networkidle0' });
        } catch (error) {
            // Provide a more helpful error message if the server is not running.
            throw new Error(
                `Failed to navigate to the page. Please ensure your local server (XAMPP) is running and the project is accessible at http://localhost/feigniter/. \nOriginal error: ${error.message}`
            );
        }

        // Wait for the header element to be rendered on the page
        await page.waitForSelector('#header');

        // Select the header element
        const header = await page.$('#header');
        expect(header).not.toBeNull(); // Ensure the element was actually found

        // Take a screenshot of just the header element
        const image = await header.screenshot();

        // Compare the screenshot with the baseline snapshot
        expect(image).toMatchImageSnapshot({
            // Explicitly define the directory for snapshots relative to this test file.
            customSnapshotsDir: path.join(__dirname, '__image_snapshots__'),
            // Define a custom name for the snapshot file.
            customSnapshotIdentifier: 'header-component',
            // Add a slight tolerance for minor anti-aliasing differences between runs.
            failureThreshold: 0.01,
            failureThresholdType: 'percent'
        });
    });
});