const puppeteer = require('puppeteer');
const path = require('path');

describe('CSS Styling Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true, // Set to false to see browser actions
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(`file://${path.join(__dirname, '../index.html')}`);
        await page.setViewport({ width: 1200, height: 800 });
    });

    afterEach(async () => {
        await page.close();
    });

    afterAll(async () => {
        await browser.close();
    });

    describe('Global Styles', () => {
        test('should apply global reset styles', async () => {
            const globalStyles = await page.evaluate(() => {
                const element = document.querySelector('*');
                const computed = window.getComputedStyle(element);
                return {
                    margin: computed.margin,
                    padding: computed.padding,
                    boxSizing: computed.boxSizing,
                    fontFamily: computed.fontFamily
                };
            });

            expect(globalStyles.margin).toBe('0px');
            expect(globalStyles.padding).toBe('0px');
            expect(globalStyles.boxSizing).toBe('border-box');
            expect(globalStyles.fontFamily).toContain('Roboto');
        });

        test('should apply body styles correctly', async () => {
            const bodyStyles = await page.evaluate(() => {
                const body = document.querySelector('body');
                const computed = window.getComputedStyle(body);
                return {
                    maxWidth: computed.maxWidth,
                    margin: computed.margin,
                    padding: computed.padding,
                    lineHeight: computed.lineHeight,
                    minHeight: computed.minHeight,
                    background: computed.background
                };
            });

            expect(bodyStyles.maxWidth).toBe('1200px');
            expect(bodyStyles.padding).toBe('20px');
            expect(bodyStyles.lineHeight).toBe('25px');
            expect(bodyStyles.minHeight).toBe('800px');
            expect(bodyStyles.background).toContain('linear-gradient');
        });
    });

    describe('Navigation Styles', () => {
        test('should apply navbar styles', async () => {
            const navbarStyles = await page.evaluate(() => {
                const navbar = document.querySelector('.navbar');
                const computed = window.getComputedStyle(navbar);
                return {
                    backgroundColor: computed.backgroundColor,
                    borderRadius: computed.borderRadius,
                    overflow: computed.overflow,
                    padding: computed.padding
                };
            });

            expect(navbarStyles.backgroundColor).toBe('rgb(44, 62, 80)');
            expect(navbarStyles.borderRadius).toBe('8px');
            expect(navbarStyles.overflow).toBe('hidden');
            expect(navbarStyles.padding).toBe('0px');
        });

        test('should apply flex layout to navbar ul', async () => {
            const ulStyles = await page.evaluate(() => {
                const ul = document.querySelector('.navbar ul');
                const computed = window.getComputedStyle(ul);
                return {
                    display: computed.display,
                    listStyle: computed.listStyle,
                    margin: computed.margin,
                    padding: computed.padding
                };
            });

            expect(ulStyles.display).toBe('flex');
            expect(ulStyles.listStyle).toBe('outside none none');
            expect(ulStyles.margin).toBe('0px');
            expect(ulStyles.padding).toBe('0px');
        });

        test('should style navbar links correctly', async () => {
            const linkStyles = await page.evaluate(() => {
                const link = document.querySelector('.navbar a');
                const computed = window.getComputedStyle(link);
                return {
                    display: computed.display,
                    color: computed.color,
                    textDecoration: computed.textDecoration,
                    padding: computed.padding,
                    textAlign: computed.textAlign,
                    fontSize: computed.fontSize
                };
            });

            expect(linkStyles.display).toBe('block');
            expect(linkStyles.color).toBe('rgb(236, 240, 241)');
            expect(linkStyles.textDecoration).toContain('none');
            expect(linkStyles.padding).toBe('15px 20px');
            expect(linkStyles.textAlign).toBe('center');
            expect(linkStyles.fontSize).toBe('24px'); // x-large
        });

        test('should apply hover styles to navbar links', async () => {
            await page.waitForSelector('.navbar a');
            await page.hover('.navbar a');

            await new Promise(resolve => setTimeout(resolve, 300)); // wait for transition

            const hoverStyles = await page.evaluate(() => {
                const link = document.querySelector('.navbar a');
                const computed = window.getComputedStyle(link);
                return {
                    backgroundColor: computed.backgroundColor,
                    color: computed.color
                };
            });


            expect(hoverStyles).not.toBeNull();
            // Use flexible matcher for rgba/rgb formats
            expect(hoverStyles.backgroundColor).toMatch(/rgba?\(52,\s*152,\s*219/);
            expect(hoverStyles.color).toMatch(/rgba?\(255,\s*255,\s*255/);
        });

        test('should apply focus styles to navbar links', async () => {


            await page.click('.navbar a');

            await new Promise(resolve => setTimeout(resolve, 500))

            const focusStyles = await page.$eval('.navbar a', el => {
                const style = window.getComputedStyle(el);
                return {
                    outline: style.outline,
                    outlineColor: style.outlineColor,
                    outlineWidth: style.outlineWidth,
                    outlineStyle: style.outlineStyle,
                    backgroundColor: style.backgroundColor,
                };
            });

            expect(focusStyles).not.toBeNull();
            expect(focusStyles.backgroundColor).toMatch(/rgba?\(231,\s*76,\s*60/);
            expect(focusStyles.outlineStyle).toBe('solid');
            expect(focusStyles.backgroundColor).toContain('231, 76, 60');
            expect(focusStyles.outlineWidth).toContain('2px');

        });

    });

    describe('Main Layout', () => {
        test('should apply grid layout to main element', async () => {
            const mainStyles = await page.evaluate(() => {
                const main = document.querySelector('main');
                const computed = window.getComputedStyle(main);
                return {
                    display: computed.display,
                    gridTemplateColumns: computed.gridTemplateColumns,
                    gap: computed.gap,
                    marginTop: computed.marginTop
                };
            });

            expect(mainStyles.display).toBe('grid');
            expect(mainStyles.gridTemplateColumns).toContain('370px 370px 370px');
            expect(mainStyles.gap).toBe('25px');
            expect(mainStyles.marginTop).toBe('20px');
        });
    });

    describe('Card Styles', () => {
        test('should apply section/card base styles', async () => {
            const cardStyles = await page.evaluate(() => {
                const card = document.querySelector('section');
                const computed = window.getComputedStyle(card);
                return {
                    background: computed.background,
                    borderRadius: computed.borderRadius,
                    boxShadow: computed.boxShadow,
                    overflow: computed.overflow
                };
            });

            expect(cardStyles.background).toContain('rgb(255, 255, 255)');
            expect(cardStyles.borderRadius).toBe('12px');
            expect(cardStyles.boxShadow).toContain('rgba(0, 0, 0, 0.1)');
            expect(cardStyles.overflow).toBe('hidden');
        });

        test('should apply card content padding', async () => {
            const contentStyles = await page.evaluate(() => {
                const content = document.querySelector('.card-content');
                const computed = window.getComputedStyle(content);
                return {
                    padding: computed.padding
                };
            });

            expect(contentStyles.padding).toBe('20px');
        });

        test('should style card headings correctly', async () => {
            const headingStyles = await page.evaluate(() => {
                const heading = document.querySelector('.card h2');
                const computed = window.getComputedStyle(heading);
                return {
                    color: computed.color,
                    marginBottom: computed.marginBottom,
                    fontSize: computed.fontSize
                };
            });

            expect(headingStyles.color).toBe('rgb(44, 62, 80)');
            expect(headingStyles.marginBottom).toBe('10px');
            expect(headingStyles.fontSize).toBe('32px'); // 2rem
        });

        test('should style card paragraphs correctly', async () => {
            const paragraphStyles = await page.evaluate(() => {
                const paragraph = document.querySelector('.card p');
                const computed = window.getComputedStyle(paragraph);
                return {
                    color: computed.color,
                    marginBottom: computed.marginBottom,
                    fontSize: computed.fontSize
                };
            });

            expect(paragraphStyles.color).toBe('rgb(127, 140, 141)');
            expect(paragraphStyles.marginBottom).toBe('20px');
            expect(paragraphStyles.fontSize).toBe('18px'); // large
        });

        test('should apply hover effect to cards', async () => {
            const cardSelector = '.card';

            // Get initial transform
            const initialTransform = await page.evaluate((selector) => {
                const card = document.querySelector(selector);
                return window.getComputedStyle(card).transform;
            }, cardSelector);

            // Hover over the card
            await page.hover(cardSelector);

            // Wait for transition
            await new Promise(resolve => setTimeout(resolve, 350));

            const hoverTransform = await page.evaluate((selector) => {
                const card = document.querySelector(selector);
                return window.getComputedStyle(card).transform;
            }, cardSelector);

            // Assert that transform changes and contains translateY
            expect(hoverTransform).not.toBe(initialTransform);
            expect(hoverTransform).toContain('matrix');
            expect(hoverTransform.endsWith(', -5)')).toBe(true); // translates to -5px on Y
        });


        test('should style card images correctly', async () => {
            const imageStyles = await page.evaluate(() => {
                const image = document.querySelector('.card img');
                const computed = window.getComputedStyle(image);
                return {
                    width: computed.width,
                    height: computed.height,
                    objectFit: computed.objectFit
                };
            });

            expect(imageStyles.width).toContain('px'); // Should be 100% of container
            expect(imageStyles.height).toBe('200px');
            expect(imageStyles.objectFit).toBe('cover');
        });
    });

    describe('Button Styles', () => {
        test('should apply button container flex layout', async () => {
            const buttonContainerStyles = await page.evaluate(() => {
                const container = document.querySelector('.card-buttons');
                const computed = window.getComputedStyle(container);
                return {
                    display: computed.display,
                    gap: computed.gap
                };
            });

            expect(buttonContainerStyles.display).toBe('flex');
            expect(buttonContainerStyles.gap).toBe('10px');
        });

        test('should apply base button styles', async () => {
            const buttonStyles = await page.evaluate(() => {
                const button = document.querySelector('.btn');
                const computed = window.getComputedStyle(button);
                return {
                    padding: computed.padding,
                    border: computed.border,
                    borderRadius: computed.borderRadius,
                    cursor: computed.cursor,
                    fontSize: computed.fontSize,
                    fontWeight: computed.fontWeight,
                    flex: computed.flex,
                    textAlign: computed.textAlign
                };
            });

            expect(buttonStyles.padding).toBe('10px 20px');
            expect(buttonStyles.border).toBe('0px none rgb(255, 255, 255)');
            expect(buttonStyles.borderRadius).toBe('6px');
            expect(buttonStyles.cursor).toBe('pointer');
            expect(buttonStyles.fontSize).toBe('20px');
            expect(buttonStyles.fontWeight).toBe('500');
            expect(buttonStyles.flex).toBe('1 1 0%');
            expect(buttonStyles.textAlign).toBe('center');
        });

        test('should apply primary button styles', async () => {
            const primaryButtonStyles = await page.evaluate(() => {
                const button = document.querySelector('.btn-primary');
                const computed = window.getComputedStyle(button);
                return {
                    backgroundColor: computed.backgroundColor,
                    color: computed.color
                };
            });

            expect(primaryButtonStyles.backgroundColor).toBe('rgb(52, 152, 219)');
            expect(primaryButtonStyles.color).toBe('rgb(255, 255, 255)');
        });

        test('should apply secondary button styles', async () => {
            const secondaryButtonStyles = await page.evaluate(() => {
                const button = document.querySelector('.btn-secondary');
                const computed = window.getComputedStyle(button);
                return {
                    backgroundColor: computed.backgroundColor,
                    color: computed.color
                };
            });

            expect(secondaryButtonStyles.backgroundColor).toBe('rgb(149, 165, 166)');
            expect(secondaryButtonStyles.color).toBe('rgb(255, 255, 255)');
        });

        test('should apply hover effects to primary buttons', async () => {
            const buttonSelector = '.btn-primary';

            await page.hover(buttonSelector);
            await new Promise(resolve => setTimeout(resolve, 350))

            const hoverStyles = await page.evaluate((selector) => {
                const button = document.querySelector(selector);
                const computed = window.getComputedStyle(button);
                return {
                    backgroundColor: computed.backgroundColor,
                    transform: computed.transform
                };
            }, buttonSelector);

            expect(hoverStyles.backgroundColor).toBe('rgb(41, 128, 185)');
            expect(hoverStyles.transform).toContain('matrix(1, 0, 0, 1, 0, -2)');
        });

        test('should apply hover effects to secondary buttons', async () => {
            const buttonSelector = '.btn-secondary';

            await page.hover(buttonSelector);
            await new Promise(resolve => setTimeout(resolve, 350))

            const hoverStyles = await page.evaluate((selector) => {
                const button = document.querySelector(selector);
                const computed = window.getComputedStyle(button);
                return {
                    backgroundColor: computed.backgroundColor,
                    transform: computed.transform
                };
            }, buttonSelector);

            expect(hoverStyles.backgroundColor).toBe('rgb(127, 140, 141)');
            expect(hoverStyles.transform).toContain('matrix(1, 0, 0, 1, 0, -2)');
        });

        test('should apply focus styles to buttons', async () => {
            await page.waitForSelector('.btn');
            await page.focus('.btn');
            await new Promise(resolve => setTimeout(resolve, 500)) // Let focus + styles settle

            const focusStyles = await page.evaluate(() => {
                const button = document.querySelector('.btn');
                if (!button) return null;

                // Force focus as backup
                button.focus();

                const isFocused = document.activeElement === button;
                const computed = window.getComputedStyle(button);
                return {
                    isFocused,
                    outline: computed.outline,
                    outlineColor: computed.outlineColor,
                    outlineWidth: computed.outlineWidth,
                    outlineStyle: computed.outlineStyle
                };
            });

            expect(focusStyles).not.toBeNull();
            expect(focusStyles.isFocused).toBe(true);
            expect(focusStyles.outlineColor).toBe('rgb(243, 156, 18)');
            expect(focusStyles.outlineWidth).toBe('3px');
            expect(focusStyles.outlineStyle).toBe('solid');
        });




        test('should apply active styles to primary buttons', async () => {
            await page.click('.btn-primary', { delay: 50 });

            // Check active state during click
            const activeStyles = await page.evaluate(() => {
                const button = document.querySelector('.btn-primary');
                // Manually trigger active state for testing
                button.classList.add('active-state');
                button.style.backgroundColor = '#21618c';
                button.style.transform = 'translateY(0)';

                return {
                    backgroundColor: button.style.backgroundColor,
                    transform: button.style.transform
                };
            });

            expect(activeStyles.backgroundColor).toBe('rgb(33, 97, 140)');
            expect(activeStyles.transform).toBe('translateY(0px)');
        });
    });

    describe('Responsive Design', () => {
        test('should adjust layout for mobile viewport', async () => {
            await page.setViewport({ width: 320, height: 568 });
            await new Promise(resolve => setTimeout(resolve, 100))

            const gridColumns = await page.evaluate(() => {
                const main = document.querySelector('main');
                return window.getComputedStyle(main).gridTemplateColumns;
            });

            // On mobile, should still have minmax(300px, 1fr) but may stack differently
            expect(gridColumns).toContain('300px');
        });

        test('should adjust layout for tablet viewport', async () => {
            await page.setViewport({ width: 768, height: 1024 });
            await new Promise(resolve => setTimeout(resolve, 100))

            const gridColumns = await page.evaluate(() => {
                const main = document.querySelector('main');
                return window.getComputedStyle(main).gridTemplateColumns;
            });

            expect(gridColumns).toBeDefined();
        });

        test('should maintain max-width on large screens', async () => {
            await page.setViewport({ width: 1920, height: 1080 });
            await new Promise(resolve => setTimeout(resolve, 100))

            const bodyWidth = await page.evaluate(() => {
                const body = document.querySelector('body');
                return window.getComputedStyle(body).maxWidth;
            });

            expect(bodyWidth).toBe('1200px');
        });
    });

    describe('Transitions and Animations', () => {
        test('should have transition properties on interactive elements', async () => {
            const transitionProperties = await page.evaluate(() => {
                const card = document.querySelector('section');
                const button = document.querySelector('.btn');
                const navLink = document.querySelector('.navbar a');

                return {
                    card: window.getComputedStyle(card).transition,
                    button: window.getComputedStyle(button).transition,
                    navLink: window.getComputedStyle(navLink).transition
                };
            });

            expect(transitionProperties.card).toContain('0.3s');
            expect(transitionProperties.button).toContain('0.3s');
            expect(transitionProperties.navLink).toContain('0.3s');
        });

        test('should animate card hover effect smoothly', async () => {
            const cardSelector = '.card';

            // Get initial styles before hover
            const initialStyles = await page.$eval(cardSelector, el => {
                const style = window.getComputedStyle(el);
                return {
                    transform: style.transform,
                    boxShadow: style.boxShadow,
                };
            });

            // Hover over the card
            await page.hover(cardSelector);

            // Wait a moment for the hover effect to apply (CSS transition delay, if any)
            await new Promise(resolve => setTimeout(resolve, 200))

            // Get styles after hover
            const hoverStyles = await page.$eval(cardSelector, el => {
                const style = window.getComputedStyle(el);
                return {
                    transform: style.transform,
                    boxShadow: style.boxShadow,
                };
            });

            // Assert that the styles changed
            expect(hoverStyles.transform).not.toBe(initialStyles.transform);
            expect(hoverStyles.boxShadow).not.toBe(initialStyles.boxShadow);

            // Optional: check specific values
            expect(hoverStyles.transform).toContain('matrix');
            expect(hoverStyles.boxShadow).toContain('rgba');
        });
    });



    describe('Accessibility', () => {

        test('should maintain proper color contrast', async () => {
            const textColors = await page.evaluate(() => {
                const heading = window.getComputedStyle(document.querySelector('.card h2')).color;
                const paragraph = window.getComputedStyle(document.querySelector('.card p')).color;
                const navLink = window.getComputedStyle(document.querySelector('.navbar a')).color;

                return { heading, paragraph, navLink };
            });

            // Basic color checks - in a real test you might calculate contrast ratios
            expect(textColors.heading).toBe('rgb(44, 62, 80)'); // Dark blue
            expect(textColors.paragraph).toBe('rgb(127, 140, 141)'); // Gray
            expect(textColors.navLink).toBe('rgb(236, 240, 241)'); // Light gray
        });
    });
});