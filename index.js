/*
 * EmmetToElement
 *
 * JavaScript library for converting Emmet-like syntax to HTMLElements.
 *
 * MIT License
 *
 * Copyright (c) 2023 Nicat Bayramov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export { emmetToElements, simplifiedEmmetToElement };

/**
 * Converts a Emmet-like script into an array of HTMLElements.
 *
 * @param {string} emmetString - The simplified Emmet-like script to convert.
 * @returns {HTMLElement[]} An array of HTMLElements.
 */
function emmetToElements(emmetString) {
  const segment = "segment_" + parseInt(Math.random()*1000);

  /**
   * Function that splits an Emmet string into manageable sections.
   *
   * Looking for '()'
   *
   * @param {string} emmetString - The Emmet syntax string.
   * @returns {Object} An object containing the processed Emmet string and a map of divided sections.
   */
  const splitEmmetIntoSections = (emmetString) => {
    const dividedSections = new Map();
    let identifierCount = 0; // Global counter

    /**
     * Function to generate a unique identifier and map it to a given emmet string.
     * @param {string} emmetString - The Emmet syntax string.
     * @returns {string} The generated unique identifier.
     */
    const mapStringToId = (emmetString) => {
      const uniqueIdentifier = `${segment}${identifierCount++}`;
      dividedSections.set(uniqueIdentifier, emmetString);
      return uniqueIdentifier;
    };

    const regPattern = /\(([^()]*)\)/;
    let matchedGroup;
    while ((matchedGroup = regPattern.exec(emmetString)) !== null) {
      emmetString = emmetString.replace(
        `(${matchedGroup[1]})`,
        mapStringToId(matchedGroup[1])
      );
    }

    return {
      dataString: emmetString,
      dividedSections,
    };
  };

  /**
   * Function that creates an array of HTML elements from an Emmet string.
   *
   * Looking for '+'
   *
   * @param {string} emmetString - The Emmet syntax string.
   * @returns {HTMLElement[]} Array of generated HTMLElements.
   */
  const createParalel = (emmetString) => {
    const elements = emmetString.split("+").map((i) => i.trim());
    const nativeElements = elements.map((element) => createParental(element));
    return nativeElements;
  };

  /**
   * Function that generates an HTML element with child elements from an Emmet string.
   *
   * Looking for '>'
   *
   * @param {string} emmetString - The Emmet syntax string.
   * @returns {HTMLElement} The generated HTMLElement.
   */
  const createParental = (emmetString) => {
    const components = emmetString.split(">").map((i) => i.trim());
    console.log(components)
    const firstComponent = components.shift();
    if (!firstComponent) {
      throw new Error("Invalid Emmet string provided");
    }
    let parentComponent = createHTMLElement(firstComponent)[0];
    let traversalParent = parentComponent;
    components.forEach((component) => {
      const children = createHTMLElement(component);
      children.forEach((child) => {
        traversalParent.appendChild(child);
      });
      traversalParent = children[0];
    });
    return parentComponent;
  };

  /**
   * Function that generates an array of HTML elements from a component string.
   *
   * @param {string} component - The component string.
   * @returns {HTMLElement[]} Array of generated HTMLElements.
   */
  const createHTMLElement = (component) => {
    if (dividedSections.has(component)) {
      return createParalel(dividedSections.get(component));
    }
    return [simplifiedEmmetToElement(component)];
  };

  emmetString = emmetString.replace(/[\t\n\r]/g, "").replace(/\s+/g, " ");
  const { dataString, dividedSections } = splitEmmetIntoSections(emmetString); // split sections
  // console.log(dataString, dividedSections);
  const elements = createParalel(dataString);
  return elements;
}

/**
 * Converts a simplified Emmet-like script into HTMLElement.
 *
 * The simplified Emmet script does not support '>', '+', and '()' operations.
 *
 * @param {string} emmet - The simplified Emmet-like script to convert.
 * @returns {HTMLElement} HTMLElement.
 */
function simplifiedEmmetToElement(emmetString) {
  emmetString = emmetString.replace(/[\t\n\r]/g, "").replace(/\s+/g, " ");

  // Inner text
  let innerText = "";
  const textIndex = emmetString.lastIndexOf("{");
  if (textIndex !== -1) {
    innerText = emmetString.substring(textIndex + 1, emmetString.indexOf("}"));
    emmetString = emmetString.substring(0, textIndex);
  }

  // Attributes
  let attributes = [];
  const attributeIndex = emmetString.lastIndexOf("[");
  if (attributeIndex !== -1) {
    const attributeText = emmetString.substring(
      attributeIndex + 1,
      emmetString.indexOf("]")
    );
    attributes = attributeText
      .trim()
      .split(" ")
      .filter((i) => i.trim())
      .map((attr) => {
        const parts = attr.trim().split("=");
        if (parts[1].indexOf('"') !== -1)
          parts[1] = parts[1].substring(1, parts[1].lastIndexOf('"'));
        return [parts[0], parts[1]];
      });
    emmetString = emmetString.replace(`[${attributeText}]`, "");
  }

  // Tag, id, class
  let [beforeClasses, ...classes] = emmetString.split(".");
  let [tagName, id] = beforeClasses.split("#");
  tagName = tagName.trim() || "div";
  classes = classes.map((i) => i.trim());

  // Convert to HTMLElements
  const element = document.createElement(tagName);
  if (id) element.id = id.trim();
  if (classes.length > 0) element.className = classes.join(" ");
  if (innerText) element.textContent = innerText;
  attributes.forEach((attr) => element.setAttribute(attr[0], attr[1]));
  return element;
}
